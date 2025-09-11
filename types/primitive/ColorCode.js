class ColorCode extends String {
  /**
   * 
   * @param {string} hex colore code
   */
  constructor(hex) {
    if (!/^0x[0-9a-f]{8}$/.test(hex)) {
      throw new Error(`Invalid ARGB color code: ${hex}`);
    }
    super(hex);
  }

  getRGB() {
    const value = this.slice(2); // без "0x"
    const a = parseInt(value.slice(0, 2), 16);
    const r = parseInt(value.slice(2, 4), 16);
    const g = parseInt(value.slice(4, 6), 16);
    const b = parseInt(value.slice(6, 8), 16);

    return {
      opacity: +(a / 255).toFixed(2),
      rgb: { r, g, b },
      hex: `#${value.slice(2)}`
    };
  }

  getHSL() {
    const { r, g, b } = this.getRGB().rgb;
    const [hr, hg, hb] = [r / 255, g / 255, b / 255];
    const max = Math.max(hr, hg, hb), min = Math.min(hr, hg, hb);
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (d !== 0) {
      switch (max) {
        case hr: h = ((hg - hb) / d + (hg < hb ? 6 : 0)); break;
        case hg: h = ((hb - hr) / d + 2); break;
        case hb: h = ((hr - hg) / d + 4); break;
      }
      h *= 60;
    }

    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
}

module.exports = { ColorCode };