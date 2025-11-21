class GearStat {
  /**
   * @param {number} id 
   * @param {string} name 
   * @param {number} level 
   */
  constructor(id, name, level) {
    if (!(typeof id === "number" && typeof name === "string")) {
      throw new Error("GearStat constructor data invalid");
    }
    this.id = id;
    this.name = name;

  }
  static fromObject(data){
    return new GearStat(data.id,data.name)
  }
}

class GearStatList extends Array {
  /**
   * @param {GearStat} items
   */
  constructor(items) {
    const validated = items.map(GearStatList._validate);
    super(...validated);

    const proxy = new Proxy(this, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          if (value === undefined) {
            throw new TypeError("Cannot assign undefined to GearStatList");
          }
          GearStatList._validate(value);
        }
        target[prop] = value;
        return true;
      }
    });

    Object.setPrototypeOf(proxy, GearStatList.prototype);
    return proxy;
  }

  static fromObject(data){
    if(data.length >0){
      return new GearStatList(data.map((el)=>GearStat.fromObject(el)))
    }
    return new GearStatList([])
  }

  /**
   * @param {*} item
   * @returns {GearStat}
   */
  static _validate(item) {
    if (!(item instanceof GearStat)) {
      throw new TypeError("GearStatList accepts only GearStat instances");
    }
    return item;
  }

  /**
   * @override
   * @param {...GearStat} items
   * @returns {number}
   */
  push(...items) {
    items.forEach(GearStatList._validate);
    return super.push(...items);
  }

  /**
   * @override
   * @param {...GearStat} items
   * @returns {number}
   */
  unshift(...items) {
    items.forEach(GearStatList._validate);
    return super.unshift(...items);
  }

  /**
   * @override
   * @param {GearStat} item
   * @param {number} [start]
   * @param {number} [end]
   * @returns {GearStatList}
   */
  fill(item, start = 0, end = this.length) {
    GearStatList._validate(item);
    return super.fill(item, start, end);
  }

  /**
   * @override
   * @param {...GearStat[]} lists
   * @returns {GearStatList}
   */
  concat(...lists) {
    const flat = lists.flat();
    flat.forEach(GearStatList._validate);
    return super.concat(...lists);
  }

  /**
   * Optional: ensure map/filter return Array, not GearStatList
   */
  static get [Symbol.species]() {
    return super[Symbol.species];
  }
}

module.exports = {
  GearStat,
  GearStatList
};
