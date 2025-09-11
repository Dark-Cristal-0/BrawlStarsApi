class PlayerTag extends String {
  /**
   * @param {string} raw
   */
  constructor(raw) {
    const normalized = raw.startsWith('#') ? raw : `#${raw}`;
    if (!/^#[A-Z0-9]{3,10}$/.test(normalized)) {
      throw new Error(`Invalid player tag format: ${raw}`);
    }
    super(normalized);
  }
}

module.exports = {
  PlayerTag,
};
