class MatchPhase extends String {
  static allowed = ['group', 'knockout', 'final'];

  /**
   * @param {'group'| 'knockout'| 'final'} phase
   */
  constructor(phase) {
    if (!MatchPhase.allowed.includes(phase)) {
      throw new Error(`Invalid match phase: ${phase}`);
    }
    super(phase);
  }
}

module.exports = {
  MatchPhase,
};
