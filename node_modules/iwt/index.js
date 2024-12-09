const TYPEOF = {
  BOOLEAN: "boolean",
  NUMBER: "number",
  STRING: "string",
  FUNCTION: "function",
  ARRAY: "array",
  DATE: "date",
  REGEXP: "regExp",
  UNDEFINED: "undefined",
  NULL: "null",
  OBJECT: "object",
  SYMBOL: "symbol"
};

/**
 * @param {any}
 * @return {string}
 */
const typeOf = function typeOf(obj) {
  const { toString } = Object.prototype;
  const map = {
    "[object Boolean]": TYPEOF.BOOLEAN,
    "[object Number]": TYPEOF.NUMBER,
    "[object String]": TYPEOF.STRING,
    "[object Function]": TYPEOF.FUNCTION,
    "[object Array]": TYPEOF.ARRAY,
    "[object Date]": TYPEOF.DATE,
    "[object RegExp]": TYPEOF.REGEXP,
    "[object Undefined]": TYPEOF.UNDEFINED,
    "[object Null]": TYPEOF.NULL,
    "[object Object]": TYPEOF.OBJECT,
    "[object Symbol]": TYPEOF.SYMBOL
  };
  return map[toString.call(obj)];
};

/**
 *
 * @param {string} type
 * @param {object} obj
 * @param {string} path
 * @param {any} defaultValue
 */
const getValue = function getValue(type, value, defaultValue) {
  /**
   * 是否设置了默认属性
   */
  const map = {
    [TYPEOF.BOOLEAN]: true,
    [TYPEOF.NUMBER]: 0,
    [TYPEOF.STRING]: "",
    [TYPEOF.FUNCTION]: new Function(),
    [TYPEOF.ARRAY]: [],
    [TYPEOF.DATE]: new Date(),
    [TYPEOF.REGEXP]: new RegExp(),
    [TYPEOF.UNDEFINED]: undefined,
    [TYPEOF.NULL]: null,
    [TYPEOF.OBJECT]: {},
    [TYPEOF.SYMBOL]: Symbol(`${TYPEOF.SYMBOL}`)
  };

  const defaultVal = defaultValue !== undefined ? defaultValue : map[type];
  return type === typeOf(value) ? value : defaultVal;
};

const iwt = {};
Object.values(TYPEOF).forEach(type => {
  iwt[type] = (value, options) => getValue(type, value, options);
});

module.exports = {
  typeOf,
  getValue,
  boolean: iwt.boolean,
  number: iwt.number,
  string: iwt.string,
  function: iwt.function,
  array: iwt.array,
  date: iwt.date,
  regExp: iwt.regExp,
  undefined: iwt.undefined,
  null: iwt.null,
  object: iwt.object,
  symbol: iwt.symbol
};
