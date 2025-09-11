const { GearStatList } = require("./GearStat");
const { StarPowerList } = require("./StarPower");
const { AccessoryList } = require("./Accessory");

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
}

class BrawlerStatList extends Array {
  /**
   * 
   * @param  {...BrawlerStat} items 
   * @returns 
   */
  constructor(...items) {
    const validated = items.map(BrawlerStatList._validate);
    super(...validated);

    const proxy = new Proxy(this, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          if (value === undefined) {
            throw new TypeError("Cannot assign undefined to BrawlerStatList");
          }
          BrawlerStatList._validate(value);
        }
        target[prop] = value;
        return true;
      }
    });

    // Зберігаємо instanceof
    Object.setPrototypeOf(proxy, BrawlerStatList.prototype);
    return proxy;
  }

  /**
     * @param {*} item
     * @returns {BrawlerStat}
     */
    static _validate(item) {
      if (!(item instanceof BrawlerStat)) {
        throw new TypeError('BrawlerStatList accepts only BrawlerStat instances');
      }
      return item;
    }
  
    /**
     * @override
     * @param {...BrawlerStat} items
     * @returns {number}
     */
    push(...items) {
      items.forEach(BrawlerStatList._validate);
      return super.push(...items);
    }
  
    /**
     * @override
     * @param {...BrawlerStat} items
     * @returns {number}
     */
    unshift(...items) {
      items.forEach(BrawlerStatList._validate);
      return super.unshift(...items);
    }
  
    /**
     * @override
     * @param {BrawlerStat} item
     * @param {number} [start]
     * @param {number} [end]
     * @returns {BrawlerStatList}
     */
    fill(item, start = 0, end = this.length) {
      BrawlerStatList._validate(item);
      return super.fill(item, start, end);
    }
  
    /**
     * @override
     * @param {...BrawlerStat[]} lists
     * @returns {BrawlerStatList}
     */
    concat(...lists) {
      const flat = lists.flat();
      flat.forEach(BrawlerStatList._validate);
      return super.concat(...lists);
    }
  
    /**
     * Optional: ensure map/filter return Array, not AccessoryList
     */
    static get [Symbol.species]() {
      return super[Symbol.species];
    }
}

module.exports = {
  BrawlerStat,
  BrawlerStatList
};
