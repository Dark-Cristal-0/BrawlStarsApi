const { AccessoryList } = require("./Accessory");
const { StarPowerList } = require("./StarPower");
const { BrawlerId } = require("./primitive/BrawlerId");

/**
 * Представляє бравлера гравця.
 */
class Brawler {
  /**
   * @param {AccessoryList} gadgets
   * @param {string} name
   * @param {BrawlerId} id
   * @param {StarPowerList} starPowers
   */
  constructor(gadgets, name, id, starPowers) {
    if (!(
      gadgets instanceof AccessoryList &&
      typeof name === "string" &&
      id instanceof BrawlerId &&
      starPowers instanceof StarPowerList
    )) {
      throw new Error("Brawler constructor data invalid");
    }

    this.gadgets = gadgets;
    this.name = name;
    this.id = id;
    this.starPowers = starPowers;
  }
}

/**
 * Список бравлерів з типобезпечною валідацією.
 */
class BrawlerList extends Array {
  /**
   * @param {...Brawler} items
   */
  constructor(...items) {
    const validated = items.map(BrawlerList._validate);
    super(...validated);

    const proxy = new Proxy(this, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          BrawlerList._validate(value);
        }
        target[prop] = value;
        return true;
      }
    });

    Object.setPrototypeOf(proxy, BrawlerList.prototype);
    return proxy;
  }

  push(...items) {
    items.forEach(BrawlerList._validate);
    return super.push(...items);
  }

  unshift(...items) {
    items.forEach(BrawlerList._validate);
    return super.unshift(...items);
  }

  concat(...lists) {
    const flat = lists.flat();
    flat.forEach(BrawlerList._validate);
    return super.concat(...lists);
  }

  fill(item, start = 0, end = this.length) {
    BrawlerList._validate(item);
    return super.fill(item, start, end);
  }

  /**
   * @private
   * @param {Brawler} item
   * @returns {Brawler}
   */
  static _validate(item) {
    if (!(item instanceof Brawler)) {
      throw new TypeError("Item must be an instance of Brawler");
    }
    return item;
  }
}

module.exports = {
  Brawler,
  BrawlerList
};
