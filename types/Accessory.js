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



class AccessoryList extends Array {
  /**
   * @param {...Accessory} items
   */
  constructor(...items) {
    const validated = items.map(AccessoryList._validate);
    super(...validated);

    const proxy = new Proxy(this, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          if (value === undefined) {
            throw new TypeError("Cannot assign undefined to AccessoryList");
          }
          AccessoryList._validate(value);
        }
        target[prop] = value;
        return true;
      }
    });

    Object.setPrototypeOf(proxy, AccessoryList.prototype);
    return proxy;
  }

  /**
   * @param {*} item
   * @returns {Accessory}
   */
  static _validate(item) {
    if (!(item instanceof Accessory)) {
      throw new TypeError('AccessoryList accepts only Accessory instances');
    }
    return item;
  }

  /**
   * @param {any[]} jsonArray
   * @returns {AccessoryList}
   */
  static fromJson(jsonArray) {
    if (!Array.isArray(jsonArray)) {
      throw new TypeError("AccessoryList.fromJson expects an array");
    }
    const items = jsonArray.map(Accessory.fromJson);
    return new AccessoryList(...items);
  }

  /**
   * @returns {void}
   */
  validate() {
    this.forEach(item => item.validate());
  }

  push(...items) {
    items.forEach(AccessoryList._validate);
    return super.push(...items);
  }

  unshift(...items) {
    items.forEach(AccessoryList._validate);
    return super.unshift(...items);
  }

  fill(item, start = 0, end = this.length) {
    AccessoryList._validate(item);
    return super.fill(item, start, end);
  }

  concat(...lists) {
    const flat = lists.flat();
    flat.forEach(AccessoryList._validate);
    return super.concat(...lists);
  }

  static get [Symbol.species]() {
    return super[Symbol.species];
  }
}

module.exports = {
  Accessory,
  AccessoryList
};
