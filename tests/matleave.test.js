import { expect, test, describe } from "vitest";
import * as matleave from "../src/utilities/matleave.js";

describe("getSunday()", () => {
  test("if it returns a Sunday", () => {
    // 18 June 2026 is a Thursday
    const inputDate = new Date("2026-06-18");
    const result = matleave.getSunday(inputDate);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(14);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });
});

describe("getSaturday()", () => {
  test("if it returns a Saturday", () => {
    // 18 June 2026 is a Thursday
    const inputDate = new Date("2026-06-18");
    const result = matleave.getSaturday(inputDate);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(20);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });
});

describe("addWeeksInclusive()", () => {
  test("if it returns the end date of the added weeks", () => {
    const startDate = new Date("2026-11-01");
    const result = matleave.addWeeksInclusive(startDate, 1);

    // 1 week - 1 day = 6 days later
    // End date should be Saturday, 7 November 2026
    expect(result.start.getFullYear()).toBe(2026);
    expect(result.start.getMonth()).toBe(10);
    expect(result.start.getDate()).toBe(1);
    expect(result.end.getFullYear()).toBe(2026);
    expect(result.end.getMonth()).toBe(10);
    expect(result.end.getDate()).toBe(7);
  });
});
