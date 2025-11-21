const { AccessoryList } = require("./Accessory");
const { StarPowerList } = require("./StarPower");
const { BrawlerId } = require("./primitive/BrawlerId");

const {TypedArray} = require("./../TypedArray")
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
  static fromObject(data){
    return new Brawler(AccessoryList.fromObject(data.gadgets),data.name,new BrawlerId(data.id),StarPowerList.fromObject(data.starPowers))
  }
}

/**
 * Типобезпечний список бравлерів.
 * @extends {TypedArray<Brawler>}
 */
class BrawlerList extends TypedArray {
  /**
   * @param {Iterable<Brawler>} [items]
   */
  constructor(items = []) {
    super(Brawler, items);
  }

  /**
   * Створює BrawlerList з plain-об'єктів.
   * @param {Array<Object>} data
   * @returns {BrawlerList}
   */
  static fromObject(data) {
    return new this(data.map(el => Brawler.fromObject(el)));
  }

  /**
   * Повертає BrawlerList після фільтрації.
   * @param {(value: Brawler, index: number, array: Brawler[]) => boolean} callback
   * @param {*} [thisArg]
   * @returns {BrawlerList}
   */
  filter(callback, thisArg) {
    const filtered = super.filter(callback, thisArg);
    return new BrawlerList(filtered);
  }

  /**
   * Повертає BrawlerList після slice.
   * @param {number} [start]
   * @param {number} [end]
   * @returns {BrawlerList}
   */
  slice(start, end) {
    const sliced = super.slice(start, end);
    return new BrawlerList(sliced);
  }

  /**
   * Об'єднує списки бравлерів.
   * @param {...(Brawler[]|BrawlerList)} lists
   * @returns {BrawlerList}
   */
  concat(...lists) {
    const result = new BrawlerList(this);
    for (const list of lists) {
      this._assertValidArray(list);
      for (const item of list) result.push(item);
    }
    return result;
  }

  /**
   * Повертає Array при map/flatMap, щоб уникнути помилок.
   */
  static get [Symbol.species]() {
    return Array;
  }
}

module.exports = {
  Brawler,
  BrawlerList
};
