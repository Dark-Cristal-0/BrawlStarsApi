class ClubRole extends String {
  static allowed = ['member', 'senior', 'vicePresident', 'president', 'notMember', 'unknown'];

  /**
   * @param {('member' | 'senior' | 'vicePresident' | 'president' | 'notMember' | 'unknown')} role
   */
  constructor(role) {
    if (!ClubRole.allowed.includes(role)) {
      throw new Error(`Invalid club role: ${role}`);
    }
    super(role);
  }
}

module.exports = {
  ClubRole,
};
