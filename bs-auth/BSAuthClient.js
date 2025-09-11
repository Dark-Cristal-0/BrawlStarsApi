/**
 * @fileoverview Клієнт для взаємодії з Brawl Stars Developer API.
 * Реалізує авторизацію, управління API-ключами та сесією.
 * Всі запити виконуються через HTTPS, з автоматичним оновленням сесії при потребі.
 */

const https = require("https");
const {getPublicIP} = require("./util/getPublicIp")





/**
 * @typedef {Object} ScopeLimit
 * @property {string} tier - Наприклад, "developer/silver"
 * @property {string} type - Тип ліміту, наприклад "throttling"
 */

/**
 * @typedef {Object} CidrLimit
 * @property {string[]} cidrs - CIDR-діапазони, наприклад ["146.120.100.22"]
 * @property {string} type - Тип обмеження, наприклад "client"
 */

/**
 * @typedef {Object} ApiKey
 * @property {string} id
 * @property {string} developerId
 * @property {string} tier
 * @property {string} name
 * @property {string} description
 * @property {string[] | null} origins
 * @property {string[]} scopes
 * @property {(ScopeLimit | CidrLimit)[]} limits
 * @property {string | null} validUntil
 * @property {string} key
 */

/**
 * @typedef {Object} ListKeysResponse
 * @property {{ code: number, message: string, detail: string | null }} status
 * @property {number} sessionExpiresInSeconds
 * @property {ApiKey[]} keys
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
   * @returns {Promise<string>} JWT-ключ у вигляді рядка.
   * @throws {Error} Якщо IP невалідний або створення ключа неуспішне.
   *
   * @example
   * const key = await client.createKey(); // автоматично визначить IP
   * const key2 = await client.createKey("193.106.145.57"); // вручну
   */
  async createKey(ip) {
    await this.ensureSession();

    const finalIP = ip || await getPublicIP();
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(finalIP)) {
      throw new Error("Невірний формат IP: " + finalIP);
    }

    const keyData = JSON.stringify({
      name: `autoCreate: ${finalIP}`,
      description: `Date: ${new Date().toLocaleDateString()}`,
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
          resolve(key);
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
   * Створює новий API-ключ для заданої IP-адреси.
   *
   * @param {string} ip - CIDR-адреса, наприклад "193.106.145.57"
   * @returns {Promise<string>} JWT-ключ у вигляді рядка.
   * @throws {Error} Якщо IP не заданий або невалідний.
   *
   * @example
   * const key = await client.createKey("193.106.145.57");
   * console.log("Створено ключ:", key);
   */
  async createKey(ip) {
    if (!ip || typeof ip !== "string") {
      throw new Error("IP повинен бути рядком");
    }

    await this.ensureSession();

    const keyData = JSON.stringify({
      name: `autoCreate: ${ip}`,
      description: `Date: ${new Date().toLocaleDateString()}`,
      cidrRanges: [ip],
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
          resolve(key);
        });
      });

      req.on("error", err => reject(new Error("Create Key Error: " + err)));
      req.write(keyData);
      req.end();
    });
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
  async revokeKey(id) {
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
