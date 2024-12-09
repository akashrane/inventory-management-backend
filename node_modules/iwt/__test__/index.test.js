const iwt = require("../index");

test("test iwt", () => {
  const func = () => {};
  expect(iwt.getValue("array", "test")).toEqual([]);
  expect(iwt.array("array")).toEqual([]);
  expect(iwt.array("number", 1)).toEqual(1);
  expect(iwt.number(1)).toEqual(1);
  expect(iwt.function(1, func)).toBe(func);
});
