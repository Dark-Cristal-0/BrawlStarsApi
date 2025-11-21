const { BSAuthClient } = require("./BSAuthClient");
const { getPublicIP } = require("../util/getPublicIp");

/**
 * Менеджер токенів для Brawl Stars API.
 * Відповідає за авторизацію, створення, повторне використання та відкликання API-ключів.
 */
class TokenManager {
  /**
   * @param {string} email - Email для входу на https://developer.brawlstars.com/
   * @param {string} password - Пароль для входу на https://developer.brawlstars.com/
   * @param {string} keyName - Назва ключа, яка буде використана при створенні
   */
  constructor(email, password, keyName) {
    /** @private */
    this.authClient = new BSAuthClient(email, password);

    /** @private @type {string} */
    this.keyName = keyName;

    /** @private @type {string|null} */
    this.token = null;

    /** @private @type {string|null} */
    this.keyId = null;
  }

  /**
   * Ініціалізує токен: виконує логін, отримує IP, створює ключ.
   * Зберігає токен і keyId для подальшого використання.
   *
   * @returns {Promise<void>}
   * @throws {Error} Якщо логін або створення ключа завершились помилкою
   */
  async init() {
    const ip = await getPublicIP();

    await this.authClient.login().then(async () => {
      
      await this.authClient.listKeys().then(async (el)=>{
        const findKey = el.keys.find((key)=>{
          if(key.name == this.keyName){
            this.token = key.key
            this.keyId = key.id
            return true
          }
        })

        if(!findKey?.id){
          
          await this.authClient.createKey(ip, this.keyName).then(async (res) => {
            this.token = res.key.key;
            this.keyId = res.key.id;
          }).catch(() => {
            throw new Error(`failed BSApi create Key\nToken Manager:${JSON.stringify(this,null,2)}`);
          });
        
        }
      }).catch(()=>{throw new Error(`failed BSApi listKeys\nToken Manager:${JSON.stringify(this,null,2)}`)})
      
    }).catch((err) => {
      throw new Error(`failed BSApi login\nErr:${err}\nToken Manager:${JSON.stringify(this,null,2)}`);
    });
  }

  /**
   * Повертає актуальний токен. Якщо токен ще не створено — викликає init().
   *
   * @returns {Promise<string>} JWT токен для авторизації в Brawl Stars API.
   */
  async getToken() {
    if (typeof this.token =="string" &&typeof this.keyId=="string") {
      
      return this.token;
    
    } else { 
      await this.init();
      return this.token;
    }
  }

  /**
   * Відкликає поточний API-ключ, якщо він існує.
   *
   * @returns {Promise<boolean>} true, якщо ключ було відкликано або не існує; false, якщо відкликання не вдалося
   */
  async deleteToken() {
    if (this.token && this.keyId) {
      const success = await this.authClient.deleteKey(this.keyId);
      if (success) {
        this.token = null;
        this.keyId = null;
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  /**
   * Примусово оновлює токен. Якщо існує — відкликає і створює новий.
   * Якщо не існує — викликає init().
   *
   * @returns {Promise<string|boolean>} Новий токен або false, якщо оновлення не вдалося
   */
  async refresh() {
    if (this.token && this.keyId) {
      const deleted = await this.deleteToken();
      if (deleted) {
        return await this.getToken();
      }
    } else {
      await this.init();
      return true;
    }
    return false;
  }
}

module.exports = { TokenManager };

