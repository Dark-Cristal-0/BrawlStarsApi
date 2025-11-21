const { ClubTag } = require("./primitive/ClubTag");
const { ClubBadgeId } = require("./primitive/ClubBadgeId");
const {TypedArray} = require("./../TypedArray")
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
 * Типобезпечний список клубів у рейтингу з обмеженням.
 * @extends {TypedArray<ClubRanking>}
 */
class ClubRankingList extends TypedArray {
  /**
   * @param {Iterable<ClubRanking>} [items]
   */
  constructor(items = []) {
    super(ClubRanking, items);
    this._assertLengthWithinLimit();
  }

  /**
   * Перевіряє, що довжина не перевищує ліміт.
   * @private
   */
  _assertLengthWithinLimit() {
    if (this.length > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
  }

  /**
   * Додає елементи в кінець.
   * @param {...ClubRanking} items
   * @returns {number}
   */
  push(...items) {
    this._assertValidArray(items);
    if (this.length + items.length > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
    return super.push(...items);
  }

  /**
   * Додає елементи на початок.
   * @param {...ClubRanking} items
   * @returns {number}
   */
  unshift(...items) {
    this._assertValidArray(items);
    if (this.length + items.length > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
    return super.unshift(...items);
  }

  /**
   * Видаляє та додає елементи.
   * @param {number} start
   * @param {number} deleteCount
   * @param {...ClubRanking} items
   * @returns {ClubRanking[]}
   */
  splice(start, deleteCount, ...items) {
    this._assertValidArray(items);
    const newLength = this.length - deleteCount + items.length;
    if (newLength > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
    return super.splice(start, deleteCount, ...items);
  }

  /**
   * Заповнює масив значенням.
   * @param {ClubRanking} value
   * @param {number} [start]
   * @param {number} [end]
   * @returns {this}
   */
  fill(value, start, end) {
    this._validate(value);
    const fillCount = (end ?? this.length) - (start ?? 0);
    if (fillCount > MAX_RANKED_CLUBS) {
      throw new RangeError(`ClubRankingList cannot exceed ${MAX_RANKED_CLUBS} entries`);
    }
    super.fill(value, start, end);
    this._assertLengthWithinLimit();
    return this;
  }

  /**
   * Об'єднує списки.
   * @param {...(ClubRanking[]|ClubRankingList)} lists
   * @returns {ClubRankingList}
   */
  concat(...lists) {
    const result = new ClubRankingList(this);
    for (const list of lists) {
      this._assertValidArray(list);
      for (const item of list) result.push(item);
    }
    return result;
  }

  /**
   * Повертає частину списку.
   * @param {number} [start]
   * @param {number} [end]
   * @returns {ClubRankingList}
   */
  slice(start, end) {
    const sliced = super.slice(start, end);
    return new ClubRankingList(sliced);
  }

  /**
   * Фільтрує список.
   * @param {(value: ClubRanking, index: number, array: ClubRanking[]) => boolean} callback
   * @param {*} [thisArg]
   * @returns {ClubRankingList}
   */
  filter(callback, thisArg) {
    const filtered = super.filter(callback, thisArg);
    return new ClubRankingList(filtered);
  }

  /**
   * Повертає Array при map/flatMap.
   */
  static get [Symbol.species]() {
    return Array;
  }
}

module.exports = {
  ClubRanking,
  ClubRankingList
};
