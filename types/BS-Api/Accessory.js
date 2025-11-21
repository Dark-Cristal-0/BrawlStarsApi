const {TypedArray} = require("./../TypedArray")
class Accessory {
  /**
   * @param {number} id 
   * @param {string} name 
   */
  constructor(id, name) {
    if (!(typeof id === "number" && typeof name === "string")) {
      throw new Error("Accessory constructor data invalid");
    }
    this.id = id;
    this.name = name;
  }

    /**
   * Створює екземпляр Accessory з plain-об’єкта.
   * Очікує об’єкт структури: { id: number, name: string }.
   * Не виконує глибоку валідацію — лише перевіряє типи.
   *
   * @param {Object} data - Plain-об’єкт, отриманий з API або внутрішньої логіки.
   * @param {number} data.id - Ідентифікатор аксесуару.
   * @param {string} data.name - Назва аксесуару.
   * @returns {Accessory}
   * @throws {TypeError} Якщо структура або типи некоректні.
   */
  static fromObject(data) {
    if (typeof data !== 'object' || data === null) {
      throw new TypeError("Accessory.fromObject: input must be a non-null object");
    }
    return new Accessory(data.id, data.name);
  }

  /**
   * @returns {void}
   */
  validate() {
    if (typeof this.id !== 'number') throw new TypeError("Accessory.id must be number");
    if (typeof this.name !== 'string') throw new TypeError("Accessory.name must be string");
  }
}



/**
 * Типобезпечний список аксесуарів.
 * @extends {TypedArray<Accessory>}
 */
class AccessoryList extends TypedArray {
  /**
   * @param {Iterable<Accessory>} [items]
   */
  constructor(items = []) {
    super(Accessory, items);
  }

  /**
   * Створює AccessoryList з plain-об'єктів.
   * @param {Array<Object>} data
   * @returns {AccessoryList}
   */
  static fromObject(data) {
    return new this(data.map(el => Accessory.fromObject(el)));
  }

  /**
   * Перевіряє кожен аксесуар через item.validate().
   */
  validate() {
    this.forEach(item => item.validate());
  }

  /**
   * Повертає AccessoryList після фільтрації.
   * @param {(value: Accessory, index: number, array: Accessory[]) => boolean} callback
   * @param {*} [thisArg]
   * @returns {AccessoryList}
   */
  filter(callback, thisArg) {
    const filtered = super.filter(callback, thisArg);
    return new AccessoryList(filtered);
  }

  /**
   * Повертає AccessoryList після slice.
   * @param {number} [start]
   * @param {number} [end]
   * @returns {AccessoryList}
   */
  slice(start, end) {
    const sliced = super.slice(start, end);
    return new AccessoryList(sliced);
  }

  /**
   * Об'єднує списки аксесуарів.
   * @param {...(Accessory[]|AccessoryList)} lists
   * @returns {AccessoryList}
   */
  concat(...lists) {
    const result = new AccessoryList(this);
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
  Accessory,
  AccessoryList
};
