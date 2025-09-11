const { PlayerTag } = require("./primitive/PlayerTag");
const { PlayerIcon } = require("./PlayerIcon");
const { ColorCode } = require("./primitive/ColorCode");
const { PlayerRankingClub } = require("./PlayerRankingClub")

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
 * Список гравців у рейтингу з обмеженням.
 */
class PlayerRankingList extends Array {
  /**
   * @param {...PlayerRanking} items
   * @throws {RangeError} Якщо перевищено ліміт.
   */
  constructor(...items) {
    if (items.length > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }

    const validated = items.map(PlayerRankingList._validate);
    super(...validated);

    const proxy = new Proxy(this, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          if (value === undefined) {
            throw new TypeError("Cannot assign undefined to PlayerRankingList");
          }
          PlayerRankingList._validate(value);
          const index = Number(prop);
          const isNewItem = index >= target.length;
          if (isNewItem && target.length >= MAX_RANKED_PLAYERS) {
            throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
          }
        }
        target[prop] = value;
        return true;
      }
    });

    Object.setPrototypeOf(proxy, PlayerRankingList.prototype);
    return proxy;
  }

  push(...items) {
    items.forEach(PlayerRankingList._validate);
    if (this.length + items.length > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
    return super.push(...items);
  }

  unshift(...items) {
    items.forEach(PlayerRankingList._validate);
    if (this.length + items.length > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
    return super.unshift(...items);
  }

  concat(...lists) {
    const flat = lists.flat();
    flat.forEach(PlayerRankingList._validate);
    if (this.length + flat.length > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
    return super.concat(...lists);
  }

  fill(item, start = 0, end = this.length) {
    PlayerRankingList._validate(item);
    const fillCount = end - start;
    if (fillCount > MAX_RANKED_PLAYERS) {
      throw new RangeError(`PlayerRankingList cannot exceed ${MAX_RANKED_PLAYERS} entries`);
    }
    return super.fill(item, start, end);
  }

  /**
   * @private
   * @param {PlayerRanking} item
   * @returns {PlayerRanking}
   * @throws {TypeError} Якщо item не є PlayerRanking.
   */
  static _validate(item) {
    if (!(item instanceof PlayerRanking)) {
      throw new TypeError("Item must be an instance of PlayerRanking");
    }
    return item;
  }
}

module.exports = {
  PlayerRanking,
  PlayerRankingList
};
