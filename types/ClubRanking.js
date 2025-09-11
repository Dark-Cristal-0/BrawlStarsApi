const { ClubTag } = require("./primitive/ClubTag");
const { ClubBadgeId } = require("./primitive/ClubBadgeId");

const MAX_RANKED_CLUBS = 100;

/**
 * Представляє клуб у рейтингу.
 */
class ClubRanking {
  /**
   * @param {ClubTag} tag - Унікальний тег клубу.
   * @param {string} name - Назва клубу.
   * @param {number} trophies - Кількість трофеїв.
   * @param {number} rank - Поточне місце в рейтингу.
   * @param {number} memberCount - Кількість учасників.
   * @param {ClubBadgeId} badgeId - Значок клубу.
   *
   * @throws {Error} Якщо типи параметрів некоректні.
   */
  constructor(tag, name, trophies, rank, memberCount, badgeId) {
    if (!(
      tag instanceof ClubTag &&
      typeof name === "string" &&
      typeof trophies === "number" &&
      typeof rank === "number" &&
      typeof memberCount === "number" &&
      badgeId instanceof ClubBadgeId
    )) {
      throw new Error("ClubRanking constructor data invalid");
    }

    this.tag = tag;
    this.name = name;
    this.trophies = trophies;
    this.rank = rank;
    this.memberCount = memberCount;
    this.badgeId = badgeId;
  }
}

/**
 * Список клубів у рейтингу з обмеженням.
 */
class ClubRankingList extends Array {
  /**
   * @param {...ClubRanking} items
   * @throws {RangeError} Якщо перевищено ліміт.
   */
  constructor(...items) {
    if (items.length > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }

    const validated = items.map(ClubRankingList._validate);
    super(...validated);

    const proxy = new Proxy(this, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          if (value === undefined) {
            throw new TypeError("Cannot assign undefined to ClubRankingList");
          }
          ClubRankingList._validate(value);
          const index = Number(prop);
          const isNewItem = index >= target.length;
          if (isNewItem && target.length >= MAX_RANKED_CLUBS) {
            throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
          }
        }
        target[prop] = value;
        return true;
      }
    });

    Object.setPrototypeOf(proxy, ClubRankingList.prototype);
    return proxy;
  }

  push(...items) {
    items.forEach(ClubRankingList._validate);
    if (this.length + items.length > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
    return super.push(...items);
  }

  unshift(...items) {
    items.forEach(ClubRankingList._validate);
    if (this.length + items.length > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
    return super.unshift(...items);
  }

  concat(...lists) {
    const flat = lists.flat();
    flat.forEach(ClubRankingList._validate);
    if (this.length + flat.length > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
    return super.concat(...lists);
  }

  fill(item, start = 0, end = this.length) {
    ClubRankingList._validate(item);
    const fillCount = end - start;
    if (fillCount > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
    return super.fill(item, start, end);
  }

  /**
   * @private
   * @param {ClubRanking} item
   * @returns {ClubRanking}
   * @throws {TypeError} Якщо item не є ClubRanking.
   */
  static _validate(item) {
    if (!(item instanceof ClubRanking)) {
      throw new TypeError("Item must be an instance of ClubRanking");
    }
    return item;
  }
}

module.exports = {
  ClubRanking,
  ClubRankingList
};
