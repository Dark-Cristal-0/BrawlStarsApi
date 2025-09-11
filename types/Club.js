const { ClubTag } = require("./primitive/ClubTag");
const { ClubMemberList } = require("./ClubMember");
const { ClubType } = require("./primitive/ClubType");
const { ClubDescription } = require("./primitive/ClubDescription");
const { ClubBadgeId } = require("./primitive/ClubBadgeId"); // виправлено назву

/**
 * Представляє клуб у Brawl Stars.
 */
class Club {
  /**
   * Створює новий екземпляр Club.
   *
   * @param {ClubTag} tag - Унікальний тег клубу.
   * @param {string} name - Назва клубу.
   * @param {ClubDescription} description - Опис клубу.
   * @param {number} trophies - Загальна кількість трофеїв у клубі.
   * @param {number} requiredTrophies - Мінімальна кількість трофеїв для вступу.
   * @param {ClubMemberList} members - Список учасників клубу.
   * @param {ClubType} type - Тип клубу.
   * @param {ClubBadgeId} badgeId -Id значка клубу.
   *
   * @throws {Error} Якщо будь-який параметр має неправильний тип.
   */
  constructor(tag, name, description, trophies, requiredTrophies, members, type, badgeId) {
    if (!(
      tag instanceof ClubTag &&
      typeof name === "string" &&
      description instanceof ClubDescription &&
      typeof trophies === "number" &&
      typeof requiredTrophies === "number" &&
      members instanceof ClubMemberList &&
      type instanceof ClubType &&
      badgeId instanceof ClubBadgeId // оновлена перевірка
    )) {
      throw new Error("Club constructor data invalid");
    }

    this.tag = tag;
    this.name = name;
    this.description = description;
    this.trophies = trophies;
    this.requiredTrophies = requiredTrophies;
    this.members = members;
    this.type = type;
    this.badgeId = badgeId;
  }
}

module.exports = {
  Club
};
