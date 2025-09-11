class ClubType extends String {
  static allowed = ['open', 'closed', 'inviteOnly', 'unknown'];

  /**
   * @param {('open' | 'closed' | 'inviteOnly' | 'unknown')} type
   */
  constructor(type) {
    if (!ClubType.allowed.includes(type)) {
      throw new Error(`Invalid club type: ${type}`);
    }
    super(type);
  }

}

module.exports = {
  ClubType,
};
