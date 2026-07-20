import { describe, expect, it } from "vitest";
import {
  CsvValidationError,
  MAX_CSV_ROWS,
  parseReviewsCsv,
} from "./parse-reviews-csv";

describe("parseReviewsCsv", () => {
  it("normalizes supported review fields", () => {
    const reviews = parseReviewsCsv(
      "text,rating,date,source\nGreat product,5,2026-07-01,Survey",
    );

    expect(reviews).toEqual([
      {
        text: "Great product",
        rating: 5,
        date: "2026-07-01T00:00:00.000Z",
        source: "Survey",
      },
    ]);
  });

  it("accepts a file containing only the required text column", () => {
    expect(parseReviewsCsv("text\nUseful report")).toEqual([
      { text: "Useful report", rating: null, date: null, source: null },
    ]);
  });

  it("rejects a missing text column", () => {
    expect(() => parseReviewsCsv("rating,source\n5,Survey")).toThrow(
      "Required column text is missing.",
    );
  });

  it("reports the row containing invalid data", () => {
    try {
      parseReviewsCsv("text,rating\nGood,excellent");
    } catch (error) {
      expect(error).toBeInstanceOf(CsvValidationError);
      expect((error as CsvValidationError).details).toEqual({
        row: 2,
        field: "rating",
      });
    }
  });

  it("rejects more than the MVP row limit", () => {
    const rows = Array.from({ length: MAX_CSV_ROWS + 1 }, (_, index) => `Review ${index}`);
    expect(() => parseReviewsCsv(["text", ...rows].join("\n"))).toThrow(
      `The CSV cannot contain more than ${MAX_CSV_ROWS} reviews.`,
    );
  });
});
