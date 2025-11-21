/**
 * @fileoverview Клієнт для взаємодії з Brawl Stars Developer API.
 * Реалізує авторизацію, управління API-ключами та сесією.
 * Всі запити виконуються через HTTPS, з автоматичним оновленням сесії при потребі.
 */

const https = require("https");
const {getPublicIP} = require("../util/getPublicIp")

/**
 * @typedef {Object} ApiStatus
 * @property {number} code - Код статусу (0 — успішно, >0 — помилка)
 * @property {string} message - Повідомлення про результат
 * @property {string | null} detail - Додаткові пояснення (може бути null)
 */

/**
 * @typedef {Object} CidrLimit
 * @property {string[]} cidrs - CIDR-діапазони, наприклад ["146.120.100.22"]
 * @property {string} type - Тип обмеження, наприклад "client"
 */

/**
 * @typedef {Object} ApiKey
 * @property {string} id - Унікальний ID ключа
 * @property {string} developerId - ID розробника
 * @property {string} tier - Рівень доступу (наприклад "developer/silver")
 * @property {string} name - Назва ключа
 * @property {string} description - Опис ключа
 * @property {string[] | null} origins - Список дозволених origin-адрес (може бути null)
 * @property {string[]} scopes - Список дозволених API (наприклад ["brawlstars"])
 * @property {CidrLimit[]} cidrRanges - Обмеження по IP
 * @property {string | null} validUntil - Дата закінчення дії ключа (може бути null)
 * @property {string} key - JWT токен
 */

/**
 * @typedef {Object} ListKeysResponse
 * @property {ApiStatus} status - Статус відповіді
 * @property {number} sessionExpiresInSeconds - Час дії сесії в секундах
 * @property {ApiKey[]} keys - Список доступних ключів
 */

/**
 * @typedef {Object} CreateKeyResponse
 * @property {ApiStatus} status - Статус відповіді
 * @property {number} sessionExpiresInSeconds - Час дії сесії в секундах
 * @property {ApiKey} key - Створений ключ
 */

/**
 * @typedef {Object} DeleteKeyResponse
 * @property {ApiStatus} status - Статус відповіді
 * @property {number} sessionExpiresInSeconds - Час дії сесії в секундах
 */

/**
 * @typedef {Object} LoginResponse
 * @property {ApiStatus} status - Статус відповіді
 * @property {number} sessionExpiresInSeconds - Час дії сесії в секундах
 */

/**
 * Клієнт для взаємодії з Brawl Stars Developer API.
 * Забезпечує авторизацію, створення, перегляд і відкликання API-ключів.
 * Автоматично оновлює сесію при запитах, якщо вона прострочена.
 */
class BSAuthClient {
  static HOSTNAME = "developer.brawlstars.com";

  static PATHS = {
    login: "/api/login",
    logout: "/api/logout",
    createKey: "/api/apikey/create",
    listKeys: "/api/apikey/list",
    revokeKey: "/api/apikey/revoke"
  };

  /**
   * @param {string} email
   * @param {string} password
   */
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.cookies = null;
    this.sessionExpiresAt = null;
  }

  /**
   * Авторизує користувача в системі Brawl Stars Developer API. 
   * Зберігає cookies та встановлює час завершення сесії.
   * @returns {Promise<true>} Повертає true при успішному логіні.
   * @throws {Error} Якщо email або пароль не задані, або авторизація неуспішна. 
   */ 
  async login() {
    if (!this.email || !this.password) {
      throw new Error("Email і пароль обов'язкові"); 
    }
    const reqData = JSON.stringify({ email: this.email, password: this.password });
    const options = {
      protocol: "https:",
      hostname: BSAuthClient.HOSTNAME,
      path: BSAuthClient.PATHS.login,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(reqData) }
    };
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => {
          const response = JSON.parse(body);
          if (response.status?.message === "ok" || res.headers["set-cookie"]) {
            this.cookies = res.headers["set-cookie"].map(v => v.split(";")[0]).join("; ");
            this.sessionExpiresAt = Date.now() + 3599 * 1000; resolve();
          } else {
            reject(new Error("Login failed"));
          }
        });
      });
      req.on("error", err => reject(new Error("Login Error: " + err)));
      req.write(reqData);
      req.end();
    });
  }

  /**
   * Створює новий API-ключ для заданої IP-адреси або автоматично визначає її.
   *
   * @param {string} [ip] - CIDR-адреса, наприклад "193.106.145.57". Якщо не задано — буде використано глобальну IP.
   * @returns {Promise<CreateKeyResponse>} JWT-ключ у вигляді рядка.
   * @throws {Error} Якщо IP невалідний або створення ключа неуспішне.
   *
   * @example
   * const key = await client.createKey(); // автоматично визначить IP та створитть назву
   * const key2 = await client.createKey("193.106.145.57","nameKey"); // вручну
   */
  async createKey(ip, name=`autoCreate`) {
    await this.ensureSession();

    const finalIP = ip || await getPublicIP();
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(finalIP)) {
      throw new Error("Невірний формат IP: " + finalIP);
    }

    const keyData = JSON.stringify({
      name: name,
      description: `[${finalIP}] Date: ${new Date().toLocaleDateString()} ${new Date().toTimeString().replace(/\(.+\)/s,"")}`,
      cidrRanges: [finalIP],
      scopes: null
    });

    const options = {
      protocol: "https:",
      hostname: BSAuthClient.HOSTNAME,
      path: BSAuthClient.PATHS.createKey,
      method: "POST",
      headers: {
        "Cookie": this.cookies,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(keyData)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => {
          const response = JSON.parse(body);
          const key = response.key?.key;
          if (!key) return reject(new Error("Key creation failed"));
          resolve(response);
        });
      });

      req.on("error", err => reject(new Error("Create Key Error: " + err)));
      req.write(keyData);
      req.end();
    });
  }

  /**
   * Перевіряє, чи сесія активна, і виконує повторну авторизацію при потребі.
   *
   * @returns {Promise<void>}
   *
   * @example
   * await client.ensureSession(); // автоматично оновить сесію, якщо вона прострочена
   */
  async ensureSession() {
    if (!this.cookies || Date.now() > this.sessionExpiresAt) {
      await this.login();
    }
  }

  /**
   * Отримує список всіх API-ключів, прив'язаних до акаунту.
   *
   * @returns {Promise<ListKeysResponse>} Об'єкт з ключами, статусом та часом завершення сесії.
   * @throws {Error} Якщо запит не вдалось виконати або розпарсити.
   *
   * @example
   * const response = await client.listKeys();
   * console.log("Ключі:", response.keys);
   */
  async listKeys() {
    await this.ensureSession();

    const options = {
      protocol: "https:",
      hostname: BSAuthClient.HOSTNAME,
      path: BSAuthClient.PATHS.listKeys,
      method: "POST",
      headers: {
        "Cookie": this.cookies,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength("{}")
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (err) {
            reject(new Error("List Keys Error: " + err));
          }
        });
      });

      req.on("error", err => reject(new Error("List Keys Request Error: " + err)));
      req.write("{}");
      req.end();
    });
  }

  /**
   * Відкликає API-ключ за його ID.
   *
   * @param {string} id - Ідентифікатор ключа.
   * @returns {Promise<boolean>} Повертає `true`, якщо відкликання успішне.
   * @throws {Error} Якщо ID не заданий або відкликання неуспішне.
   *
   * @example
   * const success = await client.revokeKey("e5ab3cf4-ab5b-49a4-bd0f-7f4a6b22a963");
   * console.log("Відкликання успішне:", success);
   */
  async deleteKey(id) {
    if (!id || typeof id !== "string") {
      throw new Error("ID ключа обов'язковий");
    }

    await this.ensureSession();

    const revokeData = JSON.stringify({ id });

    const options = {
      protocol: "https:",
      hostname: BSAuthClient.HOSTNAME,
      path: BSAuthClient.PATHS.revokeKey,
      method: "POST",
      headers: {
        "Cookie": this.cookies,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(revokeData)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => {
          try {
            /**
             * @type {DeleteKeyResponse}
             */
            const parsed = JSON.parse(body);
            if (parsed.status?.message === "ok") {
              resolve(true);
            } else {
              reject(new Error("Revoke failed"));
            }
          } catch (err) {
            reject(new Error("Revoke Parse Error: " + err));
          }
        });
      });

      req.on("error", err => reject(new Error("Revoke Request Error: " + err)));
      req.write(revokeData);
      req.end();
    });
  }

  /**
   * Завершує поточну сесію користувача.
   *
   * @returns {Promise<void>} Повертає `undefined` після завершення сесії.
   *
   * @example
   * await client.logout();
   * console.log("Сесію завершено");
   */
  async logout() {
    await this.ensureSession();

    const logoutData = JSON.stringify({});
    const options = {
      protocol: "https:",
      hostname: BSAuthClient.HOSTNAME,
      path: BSAuthClient.PATHS.logout,
      method: "POST",
      headers: {
        "Cookie": this.cookies,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(logoutData)
      }
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let body = ''
        res.on("data", (data) => {body+=data});
        res.on("end", () =>{
          resolve()
        });
      });

      req.on("error", err => {
        console.error("Logout error:", err);
        resolve();
      });

      req.write(logoutData);
      req.end();
    });
  }
}

module.exports = { BSAuthClient };



// const bs_dev = new BSAuthClient("0dark0cristal0@gmail.com","fhcty1416")
// bs_dev.login().then(()=>{
  
  
//   bs_dev.listKeys().then(async (list)=>{
    
//     list.keys.forEach((apikey)=>{
//     if(apikey.name == "testBSApi"){
//       bs_dev.deleteKey(apikey.id)
//       console.log(apikey)
//     }
//     })
//     bs_dev.listKeys().then((v)=>{
//       console.log(JSON.stringify(v.keys.map((el)=>{return{name:el.name,cidrRanges:el.cidrRanges,desc:el.description}}),null,2))
//     })
    
//   })

// })
