
class ClubDescription extends String {
  /**
   * @param {string} str
   */
  constructor(str) {
    super(str);
  }

  getColorBlocks() {
    const regex = /<c([0-9A-Fa-f]{6})>(.*?)<\/c>/gs;
    const matches = [...this.matchAll(regex)];
    return matches.map(([, hex, content]) => ({
      color: `#${hex}`,
      content: content.trim()
    }));
  }

  /**
   * Removes all <cXXXXXX> and </c> tags
   * @returns {string}
   */
  stripColorTags() {
    return this.replace(/<c[0-9A-Fa-f]{6}>|<\/c>/g, '');
  }

  /**
   * Converts tagged string to HTML with <span style="color:#XXXXXX">...</span>
   * @returns {string}
   */
  toHTML() {
    return this.replace(
      /<c([0-9A-Fa-f]{6})>(.*?)<\/c>/gs,
      (_, hex, content) => `<span style="color:#${hex}">${content.trim()}</span>`
    );
  }
}

module.exports = {
  ClubDescription
}