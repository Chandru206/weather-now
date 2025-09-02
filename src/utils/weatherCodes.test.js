import { describe, it, expect } from "vitest";
import weatherCodeMap from "./weatherCodes";

describe("weatherCodeMap", () => {
  it("maps code 0 to Clear sky", () => {
    expect(weatherCodeMap[0].label).toBe("Clear sky");
  });

  it("returns undefined for unknown codes", () => {
    expect(weatherCodeMap[1234]).toBeUndefined();
  });
});
