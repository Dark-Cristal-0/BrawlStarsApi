class EventMode extends String {
  static allowed = [
    'soloShowdown', 'duoShowdown', 'heist', 'bounty', 'siege', 'gemGrab',
    'brawlBall', 'bigGame', 'bossFight', 'roboRumble', 'takedown', 'loneStar',
    'presentPlunder', 'hotZone', 'superCityRampage', 'knockout', 'volleyBrawl',
    'basketBrawl', 'holdTheTrophy', 'trophyThieves', 'duels', 'wipeout',
    'payload', 'botDrop', 'hunters', 'lastStand', 'snowtelThieves',
    'pumpkinPlunder', 'trophyEscape', 'wipeout5V5', 'knockout5V5',
    'gemGrab5V5', 'brawlBall5V5', 'godzillaCitySmash', 'paintBrawl',
    'trioShowdown', 'zombiePlunder', 'jellyfishing', 'unknown'
  ];

  /**
   * @param {string} mode - Назва режиму гри.
   * @throws {Error} Якщо режим не входить до списку дозволених.
   */
  constructor(mode) {
    if (!EventMode.allowed.includes(mode)) {
      throw new Error(`Invalid game mode: ${mode}`);
    }
    super(mode);
  }
}

module.exports = {
  EventMode,
};
