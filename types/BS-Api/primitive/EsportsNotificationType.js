class EsportsNotificationType extends String {
  static allowed = ['matchStart', 'matchEnd', 'teamUpdate', 'scheduleChange'];

  /**
   * @param {('matchStart' | 'matchEnd' | 'teamUpdate' | 'scheduleChange')} type
   */
  constructor(type) {
    if (!EsportsNotificationType.allowed.includes(type)) {
      throw new Error(`Invalid esports notification type: ${type}`);
    }
    super(type);
  }

}

module.exports = {
  EsportsNotificationType,
};

