const { GearStatList } = require("./GearStat");
const { StarPowerList } = require("./StarPower");
const { AccessoryList } = require("./Accessory");

const {TypedArray} = require("./../TypedArray")

class BrawlerStat {
  /**
   * @param {AccessoryList} gadgets 
   * @param {StarPowerList} starPowers 
   * @param {number} id 
   * @param {number} rank 
   * @param {number} trophies 
   * @param {number} highestTrophies 
   * @param {number} power 
   * @param {GearStatList} gears 
   * @param {string} name 
   */
  constructor(gadgets, starPowers, id, rank, trophies, highestTrophies, power, gears, name) {
    if (
      !(gadgets instanceof AccessoryList &&
        starPowers instanceof StarPowerList &&
        gears instanceof GearStatList &&
        typeof id === "number" &&
        typeof rank === "number" &&
        typeof trophies === "number" &&
        typeof highestTrophies === "number" &&
        typeof power === "number" &&
        typeof name === "string")
    ) {
      throw new Error("BrawlerStat constructor arguments invalid");
    }

    this.gadgets = gadgets;
    this.starPowers = starPowers;
    this.gears = gears;

    this.id = id;
    this.rank = rank;
    this.trophies = trophies;
    this.highestTrophies = highestTrophies;
    this.power = power;
    this.name = name;
  }
  static fromObject(data){
    return new BrawlerStat(
      AccessoryList.fromObject(data.gadgets),
      StarPowerList.fromObject(data.starPowers),
      data.id,data.rank,data.trophies,data.highestTrophies,data.power,GearStatList.fromObject(data.gadgets),data.name)
  }
}

/**
 * Типобезпечний список статистик бравлерів.
 * @extends {TypedArray<BrawlerStat>}
 */
class BrawlerStatList extends TypedArray {
  /**
   * @param {Iterable<BrawlerStat>} [items]
   */
  constructor(items = []) {
    super(BrawlerStat, items);
  }

  /**
   * Створює BrawlerStatList з plain-об'єктів.
   * @param {Array<Object>} data
   * @returns {BrawlerStatList}
   */
  static fromObject(data) {
    return new this(data.map(el => BrawlerStat.fromObject(el)));
  }

  /**
   * Повертає BrawlerStatList після фільтрації.
   * @param {(value: BrawlerStat, index: number, array: BrawlerStat[]) => boolean} callback
   * @param {*} [thisArg]
   * @returns {BrawlerStatList}
   */
  filter(callback, thisArg) {
    const filtered = super.filter(callback, thisArg);
    return new BrawlerStatList(filtered);
  }

  /**
   * Повертає BrawlerStatList після slice.
   * @param {number} [start]
   * @param {number} [end]
   * @returns {BrawlerStatList}
   */
  slice(start, end) {
    const sliced = super.slice(start, end);
    return new BrawlerStatList(sliced);
  }

  /**
   * Об'єднує списки статистик.
   * @param {...(BrawlerStat[]|BrawlerStatList)} lists
   * @returns {BrawlerStatList}
   */
  concat(...lists) {
    const result = new BrawlerStatList(this);
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
  BrawlerStat,
  BrawlerStatList
};
