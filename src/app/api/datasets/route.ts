import { NextResponse } from "next/server";
import {
  CsvValidationError,
  MAX_CSV_BYTES,
  parseReviewsCsv,
} from "@/features/datasets/server/parse-reviews-csv";
import type { DatasetApiResponse } from "@/features/datasets/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(
  error: string,
  status: number,
  details: { row?: number; field?: string } = {},
) {
  return NextResponse.json<DatasetApiResponse>(
    { ok: false, error, ...details },
    { status },
  );
}

function datasetName(fileName: string) {
  return fileName.replace(/\.csv$/i, "").trim() || "Customer reviews";
}

async function readUtf8File(file: File) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(
      await file.arrayBuffer(),
    );
  } catch {
    throw new CsvValidationError("The CSV must use UTF-8 encoding.");
  }
}

export async function POST(request: Request) {
  const action = new URL(request.url).searchParams.get("action");
  if (action !== "preview" && action !== "import") {
    return errorResponse("Unsupported dataset action.", 400);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return errorResponse("Select a CSV file to continue.", 400);
  }

  if (!file.name.toLowerCase().endsWith(".csv")) {
    return errorResponse("Only CSV files are supported.", 415);
  }

  if (file.size === 0) {
    return errorResponse("The selected CSV file is empty.", 400);
  }

  if (file.size > MAX_CSV_BYTES) {
    return errorResponse("The CSV file cannot be larger than 5 MB.", 413);
  }

  try {
    const content = await readUtf8File(file);
    const reviews = parseReviewsCsv(content);

    if (action === "preview") {
      return NextResponse.json<DatasetApiResponse>({
        ok: true,
        data: {
          fileName: file.name,
          reviewCount: reviews.length,
          preview: reviews.slice(0, 5),
        },
      });
    }

    const { db } = await import("@/lib/db/client");
    const dataset = await db.dataset.create({
      data: {
        name: datasetName(file.name),
        originalFileName: file.name,
        reviewCount: reviews.length,
        reviews: {
          create: reviews.map((review) => ({
            text: review.text,
            rating: review.rating,
            source: review.source,
            reviewedAt: review.date ? new Date(review.date) : null,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        reviewCount: true,
      },
    });

    return NextResponse.json<DatasetApiResponse>(
      { ok: true, data: dataset },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof CsvValidationError) {
      return errorResponse(error.message, 422, error.details);
    }

    console.error("Dataset import failed", error);
    return errorResponse(
      "The reviews could not be saved. Check the database connection and try again.",
      503,
    );
  }
}
