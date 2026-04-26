import test from "node:test";
import assert from "node:assert/strict";
import { add, divide } from "../src/calculator.mjs";

test("add returns the sum of two numbers", () => {
  assert.equal(add(2, 3), 5);
});

test("divide returns quotient", () => {
  assert.equal(divide(8, 2), 4);
});

test("divide rejects division by zero", () => {
  assert.throws(() => divide(1, 0), /Cannot divide by zero/);
});
