import { expect, test, describe } from "vitest";
import * as matleave from "../src/utilities/matleave.js";

describe('getSunday()', () => {
  test("if it returns a Sunday", () => {
    // 14 June 2026 is a Thursday
    const inputDate = new Date("2026-06-18"); 
    const result = matleave.getSunday(inputDate);
    
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(14);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });
});