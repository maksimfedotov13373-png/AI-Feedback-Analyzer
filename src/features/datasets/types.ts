export type NormalizedReview = {
  text: string;
  rating: number | null;
  date: string | null;
  source: string | null;
};

export type DatasetPreview = {
  fileName: string;
  reviewCount: number;
  preview: NormalizedReview[];
};

export type DatasetImportResult = {
  id: string;
  name: string;
  reviewCount: number;
};

export type DatasetApiResponse =
  | { ok: true; data: DatasetPreview | DatasetImportResult }
  | { ok: false; error: string; row?: number; field?: string };
