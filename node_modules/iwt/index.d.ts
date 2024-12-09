

export interface iWt {
  typeOf: (arg: any) => string;
  getValue: (type: string, value: any, defaultValue: any) => any;
  boolean: (value: any, defaultValue: any) => boolean;
  number: (value: any, defaultValue: any) => number
  string: (value: any, defaultValue: any) => string
  function: (value: any, defaultValue: any) => Function
  array: (value: any, defaultValue: any) => []
  date: (value: any, defaultValue: any) => Date
  regExp: (value: any, defaultValue: any) => RegExp
  undefined: (value: any, defaultValue: any) => undefined
  null: (value: any, defaultValue: any) => null
  object: (value: any, defaultValue: any) => object
  symbol: (value: any, defaultValue: any) => symbol
}

declare const iwt: iWt;

export default iwt;