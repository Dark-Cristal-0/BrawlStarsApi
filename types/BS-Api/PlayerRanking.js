const { PlayerTag } = require("./primitive/PlayerTag");
const { PlayerIcon } = require("./PlayerIcon");
const { ColorCode } = require("./primitive/ColorCode");
const { PlayerRankingClub } = require("./PlayerRankingClub")
const {TypedArray} = require("./../TypedArray")
const MAX_RANKED_PLAYERS = 100;

/**
 * Представляє гравця у рейтингу.
 */
class PlayerRanking {
  /**
   * @param {number} trophies - Кількість трофеїв.
   * @param {PlayerRankingClub} club - Назва клубу (може бути порожнім рядком).
   * @param {PlayerIcon} icon - Іконка гравця.
   * @param {PlayerTag} tag - Унікальний тег гравця.
   * @param {string} name - Ім’я гравця.
   * @param {number} rank - Поточне місце в рейтингу.
   * @param {ColorCode} nameColor - Колір імені гравця.
   *
   * @throws {Error} Якщо типи параметрів некоректні.
   */
  constructor(trophies, club, icon, tag, name, rank, nameColor) {
    if (!(
      typeof trophies === "number" &&
      club instanceof PlayerRankingClub &&
      icon instanceof PlayerIcon &&
      tag instanceof PlayerTag &&
      typeof name === "string" &&
      typeof rank === "number" &&
      nameColor instanceof ColorCode
    )) {
      throw new Error("PlayerRanking constructor data invalid");
    }

    this.trophies = trophies;
    this.club = club;
    this.icon = icon;
    this.tag = tag;
    this.name = name;
    this.rank = rank;
    this.nameColor = nameColor;
  }
}


/**
 * Типобезпечний список гравців у рейтингу з обмеженням.
 * @extends {TypedArray<PlayerRanking>}
 */
class PlayerRankingList extends TypedArray {
  /**
   * @param {Iterable<PlayerRanking>} [items]
   */
  constructor(items = []) {
    super(PlayerRanking, items);
    this._assertLengthWithinLimit();
  }

  /**
   * Перевіряє, що довжина не перевищує ліміт.
   * @private
   */
  _assertLengthWithinLimit() {
    if (this.length > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
  }

  /**
   * Додає елементи в кінець.
   * @param {...PlayerRanking} items
   * @returns {number}
   */
  push(...items) {
    this._assertValidArray(items);
    if (this.length + items.length > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
    return super.push(...items);
  }

  /**
   * Додає елементи на початок.
   * @param {...PlayerRanking} items
   * @returns {number}
   */
  unshift(...items) {
    this._assertValidArray(items);
    if (this.length + items.length > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
    return super.unshift(...items);
  }

  /**
   * Видаляє та додає елементи.
   * @param {number} start
   * @param {number} deleteCount
   * @param {...PlayerRanking} items
   * @returns {PlayerRanking[]}
   */
  splice(start, deleteCount, ...items) {
    this._assertValidArray(items);
    const newLength = this.length - deleteCount + items.length;
    if (newLength > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
    return super.splice(start, deleteCount, ...items);
  }

  /**
   * Заповнює масив значенням.
   * @param {PlayerRanking} value
   * @param {number} [start]
   * @param {number} [end]
   * @returns {this}
   */
  fill(value, start, end) {
    this._validate(value);
    const fillCount = (end ?? this.length) - (start ?? 0);
    if (fillCount > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
    super.fill(value, start, end);
    this._assertLengthWithinLimit();
    return this;
  }

  /**
   * Об'єднує списки.
   * @param {...(PlayerRanking[]|PlayerRankingList)} lists
   * @returns {PlayerRankingList}
   */
  concat(...lists) {
    const result = new PlayerRankingList(this);
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
   * @returns {PlayerRankingList}
   */
  slice(start, end) {
    const sliced = super.slice(start, end);
    return new PlayerRankingList(sliced);
  }

  /**
   * Фільтрує список.
   * @param {(value: PlayerRanking, index: number, array: PlayerRanking[]) => boolean} callback
   * @param {*} [thisArg]
   * @returns {PlayerRankingList}
   */
  filter(callback, thisArg) {
    const filtered = super.filter(callback, thisArg);
    return new PlayerRankingList(filtered);
  }

  /**
   * Повертає Array при map/flatMap.
   */
  static get [Symbol.species]() {
    return Array;
  }
}

module.exports = {
  PlayerRanking,
  PlayerRankingList
};
