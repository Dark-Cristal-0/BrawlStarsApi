const {TypedArray} = require("./../TypedArray")

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
  static fromObject(data){
    return new StarPower(data.id,data.name)
  }
}

/**
 * Типобезпечний список StarPower.
 * @extends {TypedArray<StarPower>}
 */
class StarPowerList extends TypedArray {
  /**
   * @param {Iterable<StarPower>} [items]
   */
  constructor(items = []) {
    super(StarPower, items);
  }

  /**
   * Створює StarPowerList з plain-об'єктів.
   * @param {Array<Object>} data
   * @returns {StarPowerList}
   */
  static fromObject(data) {
    return new this(data.map(el => StarPower.fromObject(el)));
  }

  /**
   * Повертає StarPowerList після фільтрації.
   * @param {(value: StarPower, index: number, array: StarPower[]) => boolean} callback
   * @param {*} [thisArg]
   * @returns {StarPowerList}
   */
  filter(callback, thisArg) {
    const filtered = super.filter(callback, thisArg);
    return new StarPowerList(filtered);
  }

  /**
   * Повертає StarPowerList після slice.
   * @param {number} [start]
   * @param {number} [end]
   * @returns {StarPowerList}
   */
  slice(start, end) {
    const sliced = super.slice(start, end);
    return new StarPowerList(sliced);
  }

  /**
   * Об'єднує списки.
   * @param {...(StarPower[]|StarPowerList)} lists
   * @returns {StarPowerList}
   */
  concat(...lists) {
    const result = new StarPowerList(this);
    for (const list of lists) {
      this._assertValidArray(list);
      for (const item of list) result.push(item);
    }
    return result;
  }

  /**
   * Повертає Array при map/flatMap.
   */
  static get [Symbol.species]() {
    return Array;
  }
}

module.exports = {
  StarPower,
  StarPowerList
};
