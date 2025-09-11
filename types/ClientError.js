

class ClientError {
  /**
   * @param {object} rawError
   * @param {number} statusCode
   */
  constructor(rawError, statusCode) {
    this.reason = rawError.reason || "unknown";
    this.message = rawError.message || "Unknown error";
    this.type = rawError.type || null;
    this.detail = rawError.detail || null;
    this.statusCode = statusCode;
  }

  toString() {
    return `[${this.statusCode}] ${this.reason}: ${this.message}`;
  }
}

module.exports = { ClientError };

