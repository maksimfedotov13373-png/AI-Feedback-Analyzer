"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Download,
  FileSpreadsheet,
  LoaderCircle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  DatasetApiResponse,
  DatasetImportResult,
  DatasetPreview,
} from "@/features/datasets/types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

async function sendFile(file: File, action: "preview" | "import") {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch(`/api/datasets?action=${action}`, {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as DatasetApiResponse;

  if (!result.ok) {
    const location = result.row ? ` Row ${result.row}${result.field ? `, ${result.field}` : ""}.` : "";
    throw new Error(`${result.error}${location}`);
  }

  return result.data;
}

export function CsvUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<DatasetPreview | null>(null);
  const [imported, setImported] = useState<DatasetImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"preview" | "import" | null>(null);

  async function previewFile(selectedFile: File) {
    setFile(selectedFile);
    setPreview(null);
    setImported(null);
    setError(null);

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Only CSV files are supported.");
      return;
    }
    if (selectedFile.size > MAX_FILE_BYTES) {
      setError("The CSV file cannot be larger than 5 MB.");
      return;
    }

    setPendingAction("preview");
    try {
      const data = await sendFile(selectedFile, "preview");
      setPreview(data as DatasetPreview);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "The CSV could not be validated.");
    } finally {
      setPendingAction(null);
    }
  }

  async function importReviews() {
    if (!file || !preview) return;

    setPendingAction("import");
    setError(null);
    try {
      const data = await sendFile(file, "import");
      setImported(data as DatasetImportResult);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "The reviews could not be imported.");
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <section className="border border-neutral-900/10 bg-[#fbfaf5] p-5 shadow-[0_30px_80px_-50px_rgba(13,44,25,0.75)] sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <p className="text-xs font-bold uppercase text-emerald-700">New analysis</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
            Upload customer reviews
          </h2>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
          <FileSpreadsheet className="size-5" aria-hidden="true" />
        </span>
      </div>

      {!preview && !imported ? (
        <div className="mt-6">
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];
              if (selectedFile) void previewFile(selectedFile);
            }}
          />
          <button
            type="button"
            className="flex min-h-56 w-full flex-col items-center justify-center border border-dashed border-neutral-300 bg-white p-7 text-center transition-colors hover:border-emerald-700 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            onClick={() => inputRef.current?.click()}
            disabled={pendingAction !== null}
          >
            {pendingAction === "preview" ? (
              <LoaderCircle className="size-8 animate-spin text-emerald-800" aria-hidden="true" />
            ) : (
              <Upload className="size-8 text-emerald-800" aria-hidden="true" />
            )}
            <span className="mt-4 font-semibold text-neutral-950">
              {pendingAction === "preview" ? "Validating CSV..." : "Choose a CSV file"}
            </span>
            <span className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              Required: text. Optional: rating, date, source. Up to 500 reviews and 5 MB.
            </span>
          </button>
          <a
            href="/sample-reviews.csv"
            download
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          >
            <Download className="size-4" aria-hidden="true" />
            Download sample CSV
          </a>
        </div>
      ) : null}

      {preview && !imported ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-emerald-700 text-white">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-neutral-950">{preview.fileName}</p>
                <p className="text-xs text-neutral-600">{preview.reviewCount} valid reviews</p>
              </div>
            </div>
            <button
              type="button"
              className="text-sm font-semibold text-neutral-600 hover:text-neutral-950"
              onClick={() => inputRef.current?.click()}
            >
              Replace file
            </button>
          </div>

          <div className="mt-5 overflow-x-auto border border-neutral-200 bg-white">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead className="bg-neutral-100 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Text</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {preview.preview.map((review, index) => (
                  <tr key={`${review.text}-${index}`} className="border-t border-neutral-200 align-top">
                    <td className="max-w-sm px-4 py-3 text-neutral-800">{review.text}</td>
                    <td className="px-4 py-3 text-neutral-600">{review.rating ?? "-"}</td>
                    <td className="px-4 py-3 text-neutral-600">{review.date?.slice(0, 10) ?? "-"}</td>
                    <td className="px-4 py-3 text-neutral-600">{review.source ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-neutral-500">Preview shows the first {preview.preview.length} rows.</p>
            <Button onClick={() => void importReviews()} disabled={pendingAction !== null}>
              {pendingAction === "import" ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Import {preview.reviewCount} reviews
            </Button>
          </div>
        </div>
      ) : null}

      {imported ? (
        <div className="mt-6 bg-emerald-50 p-6 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-emerald-700 text-white">
            <Check className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-neutral-950">Reviews imported</h3>
          <p className="mt-2 text-sm text-neutral-600">
            {imported.reviewCount} reviews were saved in “{imported.name}”.
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}
    </section>
  );
}
