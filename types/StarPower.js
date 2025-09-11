class StarPower {
  /**
   * @param {number} id 
   * @param {string} name 
   */
  constructor(id, name) {
    if (!(typeof id === "number" && typeof name === "string")) {
      throw new Error("StarPower constructor data invalid");
    }
    this.id = id;
    this.name = name;
  }
}

class StarPowerList extends Array {
  /**
   * @param {...StarPower} items
   */
  constructor(...items) {
    const validated = items.map(StarPowerList._validate);
    super(...validated);

    const proxy = new Proxy(this, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          if (value === undefined) {
            throw new TypeError("Cannot assign undefined to StarPowerList");
          }
          StarPowerList._validate(value);
        }
        target[prop] = value;
        return true;
      }
    });

    Object.setPrototypeOf(proxy, StarPowerList.prototype);
    return proxy;
  }

  /**
   * @param {*} item
   * @returns {StarPower}
   */
  static _validate(item) {
    if (!(item instanceof StarPower)) {
      throw new TypeError("StarPowerList accepts only StarPower instances");
    }
    return item;
  }

  /**
   * @override
   * @param {...StarPower} items
   * @returns {number}
   */
  push(...items) {
    items.forEach(StarPowerList._validate);
    return super.push(...items);
  }

  /**
   * @override
   * @param {...StarPower} items
   * @returns {number}
   */
  unshift(...items) {
    items.forEach(StarPowerList._validate);
    return super.unshift(...items);
  }

  /**
   * @override
   * @param {StarPower} item
   * @param {number} [start]
   * @param {number} [end]
   * @returns {StarPowerList}
   */
  fill(item, start = 0, end = this.length) {
    StarPowerList._validate(item);
    return super.fill(item, start, end);
  }

  /**
   * @override
   * @param {...StarPower[]} lists
   * @returns {StarPowerList}
   */
  concat(...lists) {
    const flat = lists.flat();
    flat.forEach(StarPowerList._validate);
    return super.concat(...lists);
  }

  /**
   * Optional: ensure map/filter return Array, not StarPowerList
   */
  static get [Symbol.species]() {
    return super[Symbol.species];
  }
}

module.exports = {
  StarPower,
  StarPowerList
};
