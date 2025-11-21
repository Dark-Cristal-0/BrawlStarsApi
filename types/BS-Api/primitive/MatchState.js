class MatchState extends String {
  static allowed = ['scheduled', 'inProgress', 'completed', 'cancelled'];

  /**
   * @param {'scheduled'| 'inProgress'| 'completed'| 'cancelled'} state
   */
  constructor(state) {
    if (!MatchState.allowed.includes(state)) {
      throw new Error(`Invalid match state: ${state}`);
    }
    super(state);
  }
}

module.exports = {
  MatchState
};
