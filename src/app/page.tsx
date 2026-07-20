import { MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { CsvUpload } from "@/features/datasets/components/csv-upload";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3f1e8]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-emerald-900 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-sm font-bold sm:text-base">
            AI Feedback Analyzer
          </span>
        </div>
        <span className="hidden rounded-md border border-emerald-900/15 bg-white/50 px-3 py-1.5 text-xs font-semibold text-emerald-950 sm:block">
          CSV ingestion
        </span>
      </nav>

      <section className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12 lg:pb-24 lg:pt-20">
        <div className="relative z-10">
          <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
            <span className="h-px w-8 bg-emerald-700" />
            From raw reviews to clear priorities
          </p>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl font-semibold leading-none text-neutral-950 sm:text-6xl lg:text-7xl">
            Hear what your customers are really saying.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            Upload customer reviews and turn scattered feedback into themes,
            pain points, and practical business recommendations.
          </p>
          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 border-t border-neutral-900/10 pt-6 text-xs text-neutral-600 sm:text-sm">
            <p><strong className="block text-lg text-neutral-950">500</strong> reviews max</p>
            <p><strong className="block text-lg text-neutral-950">5 MB</strong> file limit</p>
            <p><strong className="block text-lg text-neutral-950">UTF-8</strong> CSV format</p>
          </div>
        </div>

        <div className="relative">
          <CsvUpload />
        </div>
      </section>

      <section className="border-t border-neutral-900/10 bg-white/35">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 text-sm text-neutral-600 sm:grid-cols-3 sm:px-8 lg:px-12">
          <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-800" /> Structured, validated input</p>
          <p className="flex items-center gap-2"><MessageSquareText className="size-4 text-emerald-800" /> Reviews normalized before storage</p>
          <p className="flex items-center gap-2"><Sparkles className="size-4 text-emerald-800" /> Ready for AI analysis</p>
        </div>
      </section>
    </main>
  );
}
