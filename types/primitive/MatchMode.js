class MatchMode extends String {
  static allowed = ['solo', 'duo', 'team', 'competitive'];

  /**
   * @param {('solo' | 'duo' | 'team' | 'competitive')} mode
   */
  constructor(mode) {
    if (!MatchMode.allowed.includes(mode)) {
      throw new Error(`Invalid match mode: ${mode}`);
    }
    super(mode);
  }
}

module.exports = {
  MatchMode,
};
