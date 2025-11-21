/**
 * Типобезпечний масив, який гарантує, що всі елементи є екземплярами заданого класу.
 *
 * @template T
 * @extends {Array<T>}
 * @constructor
 */
class TypedArray extends Array {
  

  /**
   * @param {new (...args: any[]) => T} Type - Конструктор класу, який буде використовуватись для перевірки типів.
   * @param {Iterable<T>} [arr=[]] - Початкові елементи масиву.
   */
  constructor(Type, arr = []) {
    super();
    if (typeof Type !== 'function') {
      throw new TypeError('Expected a class (constructor function)');
    }
    
    
    /**
     * @private
     * @type {new (...args: any[]) => T}
     */
    this._type = Type;
    for (const item of arr) this._validateAndPush(item);
    
  }

  /**
   * Перевіряє, чи елемент є валідним екземпляром типу.
   * @param {*} item
   * @throws {TypeError} Якщо тип не відповідає.
   * @protected
   */
  _validate(item) {
    if (!(item instanceof this._type)) {
      throw new TypeError(`Expected instance of ${this._type.name}, got ${this._describe(item)}`);
    }
  }

  /**
   * Перевіряє та додає елемент до масиву.
   * @param {*} item
   * @protected
   */
  _validateAndPush(item) {
    this._validate(item);
    super.push(item);
  }

  /**
   * Повертає опис типу елемента.
   * @param {*} item
   * @returns {string}
   * @protected
   */
  _describe(item) {
    if (item === null) return 'null';
    if (item === undefined) return 'undefined';
    if (typeof item === 'object') return item.constructor?.name || 'Object';
    return typeof item;
  }

  /**
   * Додає елементи в кінець масиву.
   * @param {...T} items
   * @returns {number}
   */
  push(...items) {
    for (const item of items) this._validate(item);
    return super.push(...items);
  }

  /**
   * Додає елементи на початок масиву.
   * @param {...T} items
   * @returns {number}
   */
  unshift(...items) {
    for (const item of items) this._validate(item);
    return super.unshift(...items);
  }

  /**
   * Об'єднує масиви, зберігаючи типобезпеку.
   * @param {...(T[]|TypedArray<T>)} arrays
   * @returns {TypedArray<T>}
   */
  concat(...arrays) {
    const result = new this.constructor(this._type, this);
    for (const arr of arrays) {
      this._assertValidArray(arr);
      for (const item of arr) result.push(item);
    }
    return result;
  }

  /**
   * Створює новий масив, застосовуючи функцію до кожного елемента.
   * @param {(value: T, index: number, array: T[]) => T} callback
   * @param {*} [thisArg]
   */
  map(callback, thisArg) {
    return super.map(callback, thisArg);
  }

  /**
   * Фільтрує елементи за умовою.
   * @param {(value: T, index: number, array: T[]) => boolean} callback
   * @param {*} [thisArg]
   * @returns {TypedArray<T>}
   */
  filter(callback, thisArg) {
    const filtered = super.filter(callback, thisArg);
    this._assertValidArray(filtered);
    return new this.constructor(this._type, filtered);
  }

  /**
   * Повертає частину масиву.
   * @param {number} [start]
   * @param {number} [end]
   * @returns {TypedArray<T>}
   */
  slice(start, end) {
    const sliced = super.slice(start, end);
    this._assertValidArray(sliced);
    return new this.constructor(this._type, sliced);
  }

  /**
   * Плоске перетворення масиву.
   * @param {(value: T, index: number, array: T[]) => T[]} callback
   * @param {*} [thisArg]
   */
  flatMap(callback, thisArg) {
    return super.flatMap(callback, thisArg);
  }

  /**
   * Символ для створення підкласів.
   * @returns {typeof TypedArray}
   */
  static get [Symbol.species]() {
    return Array;
  }

  /**
   * Перевіряє, що всі елементи масиву відповідають типу.
   * @param {Array<*>} array
   * @throws {TypeError}
   * @protected
   */
  _assertValidArray(array) {
    if (!Array.isArray(array)) {
      throw new TypeError('Expected an array');
    }
    for (const item of array) this._validate(item);
  }

  /**
   * Перевіряє, чи елемент є валідним типом.
   * @param {*} item
   * @returns {boolean}
   */
  isValidType(item) {
    return item instanceof this._type;
  }

  /**
   * Кастить елемент до типу або кидає помилку.
   * @param {*} item
   * @returns {T}
   * @throws {TypeError}
   */
  cast(item) {
    if (this.isValidType(item)) return item;
    throw new TypeError(`Cannot cast to ${this._type.name}`);
  }

  /**
   * Видаляє та додає елементи.
   * @param {number} start
   * @param {number} deleteCount
   * @param {...T} items
   * @returns {T[]}
   */
  splice(start, deleteCount, ...items) {
    for (const item of items) this._validate(item);
    const removed = super.splice(start, deleteCount, ...items);
    this._assertValidArray(this);
    return removed;
  }

  /**
   * Змінює порядок елементів.
   * @returns {this}
   */
  reverse() {
    super.reverse();
    this._assertValidArray(this);
    return this;
  }

  /**
   * Сортує елементи.
   * @param {(a: T, b: T) => number} [compareFn]
   * @returns {this}
   */
  sort(compareFn) {
    super.sort(compareFn);
    this._assertValidArray(this);
    return this;
  }

  /**
   * Заповнює масив значенням.
   * @param {T} value
   * @param {number} [start]
   * @param {number} [end]
   * @returns {this}
   */
  fill(value, start, end) {
    this._validate(value);
    super.fill(value, start, end);
    this._assertValidArray(this);
    return this;
  }

  /**
   * Копіює частину масиву.
   * @param {number} target
   * @param {number} start
   * @param {number} [end]
   * @returns {this}
   */
  copyWithin(target, start, end) {
    super.copyWithin(target, start, end);
    this._assertValidArray(this);
    return this;
  }
}

module.exports = {
  TypedArray
};



// class Foo {
//   constructor(v){
//     this.v = v
//   }
// }

// const arr = new TypedArray(Foo,[new Foo(1),new Foo(2),new Foo(3)])

// arr.push(new Foo(4),new Foo(5),new Foo(6))
// arr.map((v)=>v.v+10)
// console.log(arr.map((v)=>new Foo(v.v +10)))
