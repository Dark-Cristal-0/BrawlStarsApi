// ─── Основні типи ─────────────────────────────────────────────
const {Accessory,AccessoryList} = require("./Accessory");
const {Brawler,BrawlerList} = require("./Brawler");
const {BrawlerStat,BrawlerStatList} = require("./BrawlerStat");
const {ClientError} = require("./ClientError");
const {Club} = require("./Club");
const {ClubMember,ClubMemberList} = require("./ClubMember");
const {ClubRanking,ClubRankingList} = require("./ClubRanking");
const {GearStat,GearStatList} = require("./GearStat");
const {Player} = require("./Player");
const {PlayerClub} = require("./PlayerClub");
const {PlayerIcon} = require("./PlayerIcon");
const {PlayerRankingClub} = require("./PlayerRankingClub");
const {PlayerRanking} = require("./PlayerRanking");
const {StarPower,StarPowerList} = require("./StarPower");

// ─── Primitive типи ────────────────────────────────────────────
const {BrawlerId} = require("./primitive/BrawlerId");
const {ClubBadgeId} = require("./primitive/ClubBadgeId");
const {ClubDescription} = require("./primitive/ClubDescription");
const {ClubRole} = require("./primitive/ClubRole");
const {ClubTag} = require("./primitive/ClubTag");
const {ClubType} = require("./primitive/ClubType");
const {ColorCode} = require("./primitive/ColorCode");
const {EsportsNotificationType} = require("./primitive/EsportsNotificationType");
const {GameMode} = require("./primitive/GameMode");
const {MatchMode} = require("./primitive/MatchMode");
const {MatchPhase} = require("./primitive/MatchPhase");
const {MatchState} = require("./primitive/MatchState");
const {PlayerTag} = require("./primitive/PlayerTag");

// ─── Експорт усіх типів ────────────────────────────────────────
module.exports = {
  // Основні типи
  Accessory,
  AccessoryList,
  Brawler,
  BrawlerList,
  BrawlerStat,
  BrawlerStatList,
  ClientError,
  Club,
  ClubMember,
  ClubMemberList,
  ClubRanking,
  ClubRankingList,
  GearStat,
  GearStatList,
  Player,
  PlayerClub,
  PlayerIcon,
  PlayerRankingClub,
  PlayerRanking,
  StarPower,
  StarPowerList,

  // Primitive типи
  BrawlerId,
  ClubBadgeId,
  ClubDescription,
  ClubRole,
  ClubTag,
  ClubType,
  ColorCode,
  EsportsNotificationType,
  GameMode,
  MatchMode,
  MatchPhase,
  MatchState,
  PlayerTag
};
