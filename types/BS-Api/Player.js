const { PlayerTag } = require("./primitive/PlayerTag");
const { ColorCode } = require("./primitive/ColorCode");
const { PlayerIcon } = require("./PlayerIcon");
const { BrawlerStatList } = require("./BrawlerStat");
const { PlayerClub } = require("./PlayerClub");


class Player {
  /**
   * Створює новий екземпляр Player.
   * @param {PlayerClub} club - Клуб, до якого належить гравець.
   * @param {boolean} isQualifiedFromChampionshipChallenge - Чи кваліфікувався гравець через чемпіонат.
   * @param {number} threeVsThreeVictories - Кількість перемог у 3v3 режимі.
   * @param {PlayerIcon} icon - Іконка профілю гравця.
   * @param {PlayerTag} tag - Унікальний тег гравця.
   * @param {string} name - Ім’я гравця.
   * @param {number} trophies - Поточна кількість трофеїв.
   * @param {number} expLevel - Рівень досвіду гравця.
   * @param {number} expPoints - Загальна кількість досвіду.
   * @param {number} highestTrophies - Максимальна кількість трофеїв, яку гравець мав.
   * @param {number} soloVictories - Перемоги в одиночному режимі.
   * @param {number} duoVictories - Перемоги в парному режимі.
   * @param {number} bestRoboRumbleTime - Найкращий час у Robo Rumble.
   * @param {number} bestTimeAsBigBrawler - Найкращий час у режимі Big Brawler.
   * @param {BrawlerStatList} brawlers - Статистика по кожному бравлеру.
   * @param {ColorCode} nameColor - Колір імені гравця.
   * @throws {TypeError} Якщо будь-який параметр має неправильний тип.
   */
  constructor(
    club,
    isQualifiedFromChampionshipChallenge,
    threeVsThreeVictories,
    icon,
    tag,
    name,
    trophies,
    expLevel,
    expPoints,
    highestTrophies,
    soloVictories,
    duoVictories,
    bestRoboRumbleTime,
    bestTimeAsBigBrawler,
    brawlers,
    nameColor,
  ) {
    if (
      !(club instanceof PlayerClub) ||
      typeof isQualifiedFromChampionshipChallenge !== "boolean" ||
      typeof threeVsThreeVictories !== "number" ||
      !(icon instanceof PlayerIcon) ||
      !(tag instanceof PlayerTag) ||
      typeof name !== "string" ||
      typeof trophies !== "number" ||
      typeof expLevel !== "number" ||
      typeof expPoints !== "number" ||
      typeof highestTrophies !== "number" ||
      typeof soloVictories !== "number" ||
      typeof duoVictories !== "number" ||
      typeof bestRoboRumbleTime !== "number" ||
      typeof bestTimeAsBigBrawler !== "number" ||
      !(brawlers instanceof BrawlerStatList) ||
      !(nameColor instanceof ColorCode)
    ) {
      throw new TypeError("Invalid Player constructor arguments");
    }

    this.club = club;
    this.isQualifiedFromChampionshipChallenge = isQualifiedFromChampionshipChallenge;
    this["3vs3Victories"] = threeVsThreeVictories;
    this.icon = icon;
    this.tag = tag;
    this.name = name;
    this.trophies = trophies;
    this.expLevel = expLevel;
    this.expPoints = expPoints;
    this.highestTrophies = highestTrophies;
    this.soloVictories = soloVictories;
    this.duoVictories = duoVictories;
    this.bestRoboRumbleTime = bestRoboRumbleTime;
    this.bestTimeAsBigBrawler = bestTimeAsBigBrawler;
    this.brawlers = brawlers;
    this.nameColor = nameColor;
  }
  static fromObject(data){
    return new Player(
      PlayerClub.fromObject(data.club),
      data.isQualifiedFromChampionshipChallenge,
      data["3vs3Victories"],
      PlayerIcon.fromObject(data.icon),
      new PlayerTag(data.tag),
      data.name,
      data.trophies,
      data.expLevel,data.expPoints,
      data.highestTrophies,
      data.soloVictories,
      data.duoVictories,
      data.bestRoboRumbleTime,data.bestTimeAsBigBrawler,
      BrawlerStatList.fromObject(data.brawlers),data.nameColor?new ColorCode(data.nameColor):new ColorCode("0xff000000"))
  }
}

module.exports = {
  Player
};
