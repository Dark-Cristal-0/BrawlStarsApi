const { TypedArray } = require('../types/TypedArray');

class Foo {
  constructor(value) {
    this.value = value;
  }
}

class Bar {}

const tests = [];
let currentBeforeEach = () => {};

function describe(name, fn) {
  console.log(`\n📦 ${name}`);
  fn();
}

function test(name, fn) {
  tests.push({ name, fn });
}

function beforeEach(fn) {
  currentBeforeEach = fn;
}

function runTests() {
  for (const { name, fn } of tests) {
    try {
      currentBeforeEach();
      fn();
      console.log(`✅ ${name}`);
    } catch (err) {
      console.error(`❌ ${name}`);
      console.error(`   ${err}`);
    }
  }
}

function expect(received) {
  return {
    toBe(expected) {
      if (received !== expected) throw new Error(`Expected ${received} to be ${expected}`);
    },
    toEqual(expected) {
      const r = JSON.stringify(received);
      const e = JSON.stringify(expected);
      if (r !== e) throw new Error(`Expected ${r} to equal ${e}`);
    },
    toThrow(expectedError) {
      let threw = false;
      try {
        received();
      } catch (err) {
        threw = true;
        if (expectedError && !(err instanceof expectedError)) {
          throw new Error(`Expected error of type ${expectedError.name}, got ${err.constructor.name}`);
        }
      }
      if (!threw) throw new Error(`Expected function to throw`);
    },
    toBeInstanceOf(cls) {
      if (!(received instanceof cls)) throw new Error(`Expected instance of ${cls.name}`);
    },
    toContain(item) {
      if (!Array.isArray(received) || !received.includes(item)) {
        throw new Error(`Expected array to contain ${item}`);
      }
    }
  };
}

describe('TypedArray', () => {
  let arr, a, b, c;

  beforeEach(() => {
    a = new Foo(1);
    b = new Foo(2);
    c = new Foo(3);
    arr = new TypedArray(Foo, [a, b]);
  });

  test('constructor throws on invalid type', () => {
    expect(() => new TypedArray(null, [])).toThrow(TypeError);
  });

  test('push adds valid items', () => {
    expect(arr.push(c)).toBe(3);
    expect(arr[2]).toBe(c);
  });

  test('push throws on invalid item', () => {
    expect(() => arr.push(new Bar())).toThrow(TypeError);
  });

  test('unshift adds valid items', () => {
    expect(arr.unshift(c)).toBe(3);
    expect(arr[0]).toBe(c);
  });

  test('concat merges arrays with valid items', () => {
    const d = new Foo(4);
    const result = arr.concat([c, d]);
    expect(result).toBeInstanceOf(TypedArray);
    expect(result.length).toBe(4);
    expect(result[2]).toBe(c);
  });

  test('concat throws on invalid array', () => {
    expect(() => arr.concat([new Bar()])).toThrow(TypeError);
  });

  test('map returns Array, not TypedArray', () => {
    const result = arr.map(x => x.value + 10);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBe(11);
  });

  test('filter returns TypedArray with subset', () => {
    const result = arr.filter(x => x.value === 1);
    expect(result).toBeInstanceOf(TypedArray);
    expect(result.length).toBe(1);
    expect(result[0]).toBe(a);
  });

  test('slice returns TypedArray', () => {
    const result = arr.slice(0, 1);
    expect(result).toBeInstanceOf(TypedArray);
    expect(result[0]).toBe(a);
  });

  test('flatMap returns Array', () => {
    const result = arr.flatMap(x => [x, new Foo(x.value + 100)]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(4);
    expect(result[1].value).toBe(101);
  });

  test('splice removes and inserts correctly', () => {
    const removed = arr.splice(1, 1, c);
    expect(removed).toEqual([b]);
    expect(arr[1]).toBe(c);
  });

  test('splice throws on invalid insert', () => {
    expect(() => arr.splice(1, 0, new Bar())).toThrow(TypeError);
  });

  test('reverse mutates and preserves types', () => {
    arr.reverse();
    expect(arr[0]).toBe(b);
    expect(arr[1]).toBe(a);
  });

  test('sort mutates and preserves types', () => {
    arr.sort((x, y) => y.value - x.value);
    expect(arr[0]).toBe(b);
  });

  test('fill replaces values with valid type', () => {
    arr.fill(c);
    expect(arr.every(x => x === c)).toBe(true);
  });

  test('fill throws on invalid value', () => {
    expect(() => arr.fill(new Bar())).toThrow(TypeError);
  });

  test('copyWithin mutates and preserves types', () => {
    arr.push(c);
    arr.copyWithin(1, 0, 1);
    expect(arr[1]).toBe(a);
  });

  test('isValidType returns true for valid instance', () => {
    expect(arr.isValidType(a)).toBe(true);
  });

  test('isValidType returns false for invalid instance', () => {
    expect(arr.isValidType(new Bar())).toBe(false);
  });

  test('cast returns item if valid', () => {
    expect(arr.cast(a)).toBe(a);
  });

  test('cast throws if invalid', () => {
    expect(() => arr.cast(new Bar())).toThrow(TypeError);
  });

  test('from throws if Type is missing', () => {
    class Broken extends TypedArray {}
    expect(() => Broken.from([a])).toThrow(Error);
  });
});

runTests();
