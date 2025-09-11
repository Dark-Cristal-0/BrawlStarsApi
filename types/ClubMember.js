const { PlayerTag } = require("./primitive/PlayerTag");
const { ClubRole } = require("./primitive/ClubRole");
const { PlayerIcon } = require("./PlayerIcon");
const { ColorCode } = require("./primitive/ColorCode");

const MAX_CLUB_MEMBERS = 30;

/**
 * Представляє учасника клубу.
 */
class ClubMember {
  /**
   * Створює нового учасника клубу.
   *
   * @param {PlayerIcon} icon - Іконка гравця.
   * @param {PlayerTag} tag - Унікальний тег гравця.
   * @param {string} name - Ім’я гравця.
   * @param {number} trophies - Кількість трофеїв у гравця.
   * @param {ClubRole} role - Роль гравця в клубі (лідер, заступник тощо).
   * @param {ColorCode} nameColor - Колір імені гравця.
   *
   * @throws {Error} Якщо будь-який параметр має неправильний тип.
   */
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
}

/**
 * Масив учасників клубу з обмеженням у 30 гравців.
 * Забезпечує валідацію кожного елемента.
 */
class ClubMemberList extends Array {
  /**
   * @param {...ClubMember} items - Учасники клубу.
   * @throws {RangeError} Якщо кількість учасників перевищує ліміт.
   */
  constructor(...items) {
    if (items.length > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }

    const validated = items.map(ClubMemberList._validate);
    super(...validated);

    const proxy = new Proxy(this, {
      set(target, prop, value) {
        if (!isNaN(prop)) {
          if (value === undefined) {
            throw new TypeError("Cannot assign undefined to ClubMemberList");
          }
          ClubMemberList._validate(value);
          const index = Number(prop);
          const isNewItem = index >= target.length;
          if (isNewItem && target.length >= MAX_CLUB_MEMBERS) {
            throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
          }
        }
        target[prop] = value;
        return true;
      }
    });

    Object.setPrototypeOf(proxy, ClubMemberList.prototype);
    return proxy;
  }

  /**
   * Додає учасників у кінець списку.
   * @param {...ClubMember} items
   * @returns {number} Нова довжина списку.
   * @throws {RangeError} Якщо перевищено ліміт.
   */
  push(...items) {
    items.forEach(ClubMemberList._validate);
    if (this.length + items.length > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
    return super.push(...items);
  }

  /**
   * Додає учасників на початок списку.
   * @param {...ClubMember} items
   * @returns {number} Нова довжина списку.
   * @throws {RangeError} Якщо перевищено ліміт.
   */
  unshift(...items) {
    items.forEach(ClubMemberList._validate);
    if (this.length + items.length > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
    return super.unshift(...items);
  }

  /**
   * Об'єднує поточний список з іншими.
   * @param {...ClubMember[]} lists
   * @returns {ClubMember[]} Новий масив.
   * @throws {RangeError} Якщо перевищено ліміт.
   */
  concat(...lists) {
    const flat = lists.flat();
    flat.forEach(ClubMemberList._validate);
    if (this.length + flat.length > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
    return super.concat(...lists);
  }

  /**
   * Заповнює частину списку одним учасником.
   * @param {ClubMember} item
   * @param {number} [start=0]
   * @param {number} [end=this.length]
   * @returns {ClubMemberList}
   * @throws {RangeError} Якщо перевищено ліміт.
   */
  fill(item, start = 0, end = this.length) {
    ClubMemberList._validate(item);
    const fillCount = end - start;
    if (fillCount > MAX_CLUB_MEMBERS) {
      throw new RangeError(`ClubMemberList cannot exceed ${MAX_CLUB_MEMBERS} members`);
    }
    return super.fill(item, start, end);
  }

  /**
   * Перевіряє, чи елемент є валідним ClubMember.
   * @private
   * @param {ClubMember} item
   * @returns {ClubMember}
   * @throws {TypeError} Якщо елемент не є ClubMember.
   */
  static _validate(item) {
    if (!(item instanceof ClubMember)) {
      throw new TypeError("Item must be an instance of ClubMember");
    }
    return item;
  }
}

module.exports = {
  ClubMember,
  ClubMemberList
};
