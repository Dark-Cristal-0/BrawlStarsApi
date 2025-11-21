class BrawlerId extends Number {
  /**
   * @param {number} id
   */
  constructor(id) {
    if (!Number.isInteger(id) || id < 0) {
      throw new Error(`Invalid brawler ID: ${id}`);
    }
    super(id);
  }
}

module.exports = {
  BrawlerId
};
