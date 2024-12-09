# iwt

iwt is a javascript utility that returns the value passed in when the passed variable is the value of the type you want, otherwise it returns the value of the default type.

<!-- iwt是一个javascript实用程序，当传递的变量是所需类型的值时，它会返回传入的值，否则它将返回默认类型的值。
 -->

## Example Usage

```js
var iwt = require("iwt");
```

```js
const arr = { a: ["a"], b: 1 };
const obj = { a: { a: 1 }, b: 1 };

iwt.array(arr.a); // ['a'];
iwt.array(arr.b); // [];
iwt.array(arr.b, ["b"]); // ['b'];

iwt.object(obj.a); // {a: 1};
iwt.object(obj.b); // {};
iwt.object(obj.b, { b: 1 }); // {b: 1};

// ...
// iwt.null
// iwt.undefined
// iwt.function
// iwt.boolean
// iwt.number
// iwt.null
// iwt.null

const get = require("lodash/get");
const a = {};
iwt.object(get(a, "b.c.e.f.g.h")); // {};
```

## API

| methods                           | return value                                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| array(any, defaultValue)          | []                                                                                                          |
| object(any, defaultValue)         | {}                                                                                                          |
| function(any, defaultValue)       | new Function()                                                                                              |
| boolean(any, defaultValue)        | true                                                                                                        |
| string(any, defaultValue)         | ''                                                                                                          |
| number(any, defaultValue)         | 0                                                                                                           |
| undefined(any, defaultValue)      | undefined                                                                                                   |
| null(any, defaultValue)           | null                                                                                                        |
| date(any, defaultValue)           | new Date()                                                                                                  |
| regExp(any, defaultValue)         | new RegExp()                                                                                                |
| symbol(any, defaultValue)         | Symbol('symbol')                                                                                            |
| getValue(type, any, defaultValue) | 无                                                                                                          |
| typeOf(any)                       | "number","string","function", "regExp", "null", "undefined", "date", "boolean", "object", "array", "symbol" |
