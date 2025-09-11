const { BSAuthClient } = require("./BSAuthClient");
const { getPublicIP } = require("./util/getPublicIp");

class TokenManager {
  /**
   * @param {string} email
   * @param {string} password
   */
  constructor(email, password) {
    this.authClient = new BSAuthClient(email, password);
    this.token = null;
    this.keyId = null;
    this.ip = null;
  }



  async getToken() {
    if (this.token) return this.token;

    await this.authClient.login();
    this.ip = await getPublicIP();

    const keys = await this.authClient.listKeys();
    const existingKey = keys.keys.find(k =>
      k.cidrRanges.includes(this.ip)
    );

    if (existingKey) {
      this.token = existingKey.key;
      this.keyId = existingKey.id;
      return this.token;
    }

    this.token = await this.authClient.createKey(this.ip);
    const updatedKeys = await this.authClient.listKeys();
    const newKey = updatedKeys.keys.find(k => k.key === this.token);
    this.keyId = newKey?.id || null;

    return this.token;
  }



  async revoke() {
    if (!this.keyId) return false;
      return await this.authClient.revokeKey(this.keyId);
    }

    async refresh() {
    await this.authClient.login();
    this.ip = await getPublicIP();

    const keys = await this.authClient.listKeys();
    const reusable = keys.keys.find(k => k.cidrRanges.includes(this.ip));

    if (reusable) {
      this.token = reusable.key;
      this.keyId = reusable.id;
      return this.token;
    }

    if (this.keyId) {
      await this.authClient.revokeKey(this.keyId);
    }

    this.token = await this.authClient.createKey(this.ip);
    const updatedKeys = await this.authClient.listKeys();
    const newKey = updatedKeys.keys.find(k => k.key === this.token);
    this.keyId = newKey?.id || null;

    return this.token;
  }

  async cleanup() {
    if (this.keyId) {
      await this.authClient.revokeKey(this.keyId);
      this.token = null;
      this.keyId = null;
    }
  }

}

module.exports = { TokenManager };
