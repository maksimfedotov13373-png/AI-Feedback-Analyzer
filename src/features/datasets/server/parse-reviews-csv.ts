import { parse } from "csv-parse/sync";
import type { NormalizedReview } from "@/features/datasets/types";

export const MAX_CSV_BYTES = 5 * 1024 * 1024;
export const MAX_CSV_ROWS = 500;

const allowedHeaders = ["text", "rating", "date", "source"] as const;

export class CsvValidationError extends Error {
  constructor(
    message: string,
    public readonly details: { row?: number; field?: string } = {},
  ) {
    super(message);
    this.name = "CsvValidationError";
  }
}

function normalizeOptional(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function parseRating(value: string | undefined, row: number) {
  const normalized = normalizeOptional(value);
  if (normalized === null) return null;

  const rating = Number(normalized);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    throw new CsvValidationError("Rating must be a number between 0 and 5.", {
      row,
      field: "rating",
    });
  }

  return rating;
}

function parseDate(value: string | undefined, row: number) {
  const normalized = normalizeOptional(value);
  if (normalized === null) return null;

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    throw new CsvValidationError("Date must be a valid date.", {
      row,
      field: "date",
    });
  }

  return date.toISOString();
}

export function parseReviewsCsv(content: string): NormalizedReview[] {
  let records: string[][];

  try {
    records = parse(content, {
      bom: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: false,
    });
  } catch {
    throw new CsvValidationError(
      "The CSV structure is invalid. Check delimiters, quotes, and column counts.",
    );
  }

  if (records.length < 2) {
    throw new CsvValidationError("The CSV must contain a header and at least one review.");
  }

  const headers = records[0].map((header) => header.trim().toLowerCase());
  const duplicateHeaders = headers.filter(
    (header, index) => headers.indexOf(header) !== index,
  );
  if (duplicateHeaders.length > 0) {
    throw new CsvValidationError(`Duplicate column: ${duplicateHeaders[0]}.`);
  }

  const unexpectedHeader = headers.find(
    (header) => !allowedHeaders.includes(header as (typeof allowedHeaders)[number]),
  );
  if (unexpectedHeader) {
    throw new CsvValidationError(
      `Unsupported column: ${unexpectedHeader}. Allowed columns are text, rating, date, and source.`,
    );
  }

  const textIndex = headers.indexOf("text");
  if (textIndex === -1) {
    throw new CsvValidationError("Required column text is missing.", { field: "text" });
  }

  const rows = records.slice(1);
  if (rows.length > MAX_CSV_ROWS) {
    throw new CsvValidationError(`The CSV cannot contain more than ${MAX_CSV_ROWS} reviews.`);
  }

  return rows.map((values, index) => {
    const row = index + 2;
    const valueFor = (field: string) => {
      const fieldIndex = headers.indexOf(field);
      return fieldIndex === -1 ? undefined : values[fieldIndex];
    };
    const text = values[textIndex]?.trim();

    if (!text) {
      throw new CsvValidationError("Review text cannot be empty.", {
        row,
        field: "text",
      });
    }

    return {
      text,
      rating: parseRating(valueFor("rating"), row),
      date: parseDate(valueFor("date"), row),
      source: normalizeOptional(valueFor("source")),
    };
  });
}
