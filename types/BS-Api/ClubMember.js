const { PlayerTag } = require("./primitive/PlayerTag");
const { ClubRole } = require("./primitive/ClubRole");
const { PlayerIcon } = require("./PlayerIcon");
const { ColorCode } = require("./primitive/ColorCode");

const {TypedArray} = require("./../TypedArray")
const MAX_CLUB_MEMBERS = 30;

class ClubMember {
  constructor(icon, tag, name, trophies, role, nameColor) {
    if (!(
      icon instanceof PlayerIcon &&
      tag instanceof PlayerTag &&
      typeof name === "string" &&
      typeof trophies === "number" &&
      role instanceof ClubRole &&
      nameColor instanceof ColorCode
    )) {
      throw new Error("ClubMember constructor data invalid");
    }

    this.icon = icon;
    this.tag = tag;
    this.name = name;
    this.trophies = trophies;
    this.role = role;
    this.nameColor = nameColor;
  }
  static fromObject(data){
    return new ClubMember(PlayerIcon.fromObject(data.icon),new PlayerTag(data.tag),data.name,data.trophies,new ClubRole(data.role),new ColorCode(data.nameColor))
  }
}

/**
 * Типобезпечний список учасників клубу з обмеженням на кількість.
 * @extends {TypedArray<ClubMember>}
 */
class ClubMemberList extends TypedArray {
  /**
   * @param {Iterable<ClubMember>} [items]
   */
  constructor(items = []) {
    super(ClubMember, items);
    this._assertLengthWithinLimit();
  }

  /**
   * Створює ClubMemberList з plain-об'єктів.
   * @param {Array<Object>} data
   * @returns {ClubMemberList}
   */
  static fromObject(data) {
    return new this(data.map(el => ClubMember.fromObject(el)));
  }

  /**
   * Перевіряє, що довжина не перевищує ліміт.
   * @private
   */
  _assertLengthWithinLimit() {
    if (this.length > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
  }

  /**
   * Додає елементи в кінець.
   * @param {...ClubMember} items
   * @returns {number}
   */
  push(...items) {
    this._assertValidArray(items);
    const newLength = this.length + items.length;
    if (newLength > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
    return super.push(...items);
  }

  /**
   * Додає елементи на початок.
   * @param {...ClubMember} items
   * @returns {number}
   */
  unshift(...items) {
    this._assertValidArray(items);
    const newLength = this.length + items.length;
    if (newLength > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
    return super.unshift(...items);
  }

  /**
   * Видаляє та додає елементи.
   * @param {number} start
   * @param {number} deleteCount
   * @param {...ClubMember} items
   * @returns {ClubMember[]}
   */
  splice(start, deleteCount, ...items) {
    this._assertValidArray(items);
    const newLength = this.length - deleteCount + items.length;
    if (newLength > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
    return super.splice(start, deleteCount, ...items);
  }

  /**
   * Заповнює масив значенням.
   * @param {ClubMember} value
   * @param {number} [start]
   * @param {number} [end]
   * @returns {this}
   */
  fill(value, start, end) {
    this._validate(value);
    const fillCount = (end ?? this.length) - (start ?? 0);
    if (fillCount + this.length > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
    super.fill(value, start, end);
    this._assertLengthWithinLimit();
    return this;
  }

  /**
   * Сортує елементи.
   * @param {(a: ClubMember, b: ClubMember) => number} [compareFn]
   * @returns {ClubMemberList}
   */
  sort(compareFn) {
    const sorted = super.slice().sort(compareFn);
    return new ClubMemberList(sorted);
  }

  /**
   * Змінює порядок елементів.
   * @returns {ClubMemberList}
   */
  reverse() {
    const reversed = super.slice().reverse();
    return new ClubMemberList(reversed);
  }

  /**
   * Об'єднує списки.
   * @param {...(ClubMember[]|ClubMemberList)} lists
   * @returns {ClubMemberList}
   */
  concat(...lists) {
    const result = new ClubMemberList(this);
    for (const list of lists) {
      this._assertValidArray(list);
      for (const item of list) result.push(item);
    }
    return result;
  }

  /**
   * Повертає частину списку.
   * @param {number} [start]
   * @param {number} [end]
   * @returns {ClubMemberList}
   */
  slice(start, end) {
    const sliced = super.slice(start, end);
    return new ClubMemberList(sliced);
  }

  /**
   * Фільтрує список.
   * @param {(value: ClubMember, index: number, array: ClubMember[]) => boolean} callback
   * @param {*} [thisArg]
   * @returns {ClubMemberList}
   */
  filter(callback, thisArg) {
    const filtered = super.filter(callback, thisArg);
    return new ClubMemberList(filtered);
  }

  /**
   * Повертає Array при map/flatMap.
   */
  static get [Symbol.species]() {
    return Array;
  }
}

module.exports = {
  ClubMember,
  ClubMemberList
};
