import {
  ArrowUpRight,
  BarChart3,
  FileSpreadsheet,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const outcomes = [
  { label: "Sentiment", value: "Positive / neutral / negative", icon: BarChart3 },
  { label: "Recurring themes", value: "Grouped by frequency and impact", icon: MessageSquareText },
  { label: "Next actions", value: "Evidence-backed recommendations", icon: Lightbulb },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3f1e8]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-900 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-sm font-bold sm:text-base">
            AI Feedback Analyzer
          </span>
        </div>
        <span className="hidden rounded-md border border-emerald-900/15 bg-white/50 px-3 py-1.5 text-xs font-semibold text-emerald-950 sm:block">
          MVP foundation
        </span>
      </nav>

      <section className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:pb-24 lg:pt-20">
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
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button size="lg" disabled>
              <Upload className="size-4" aria-hidden="true" />
              Upload CSV
            </Button>
            <span className="text-sm text-neutral-500">CSV upload arrives in the next stage</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative border border-neutral-900/10 bg-[#17251d] p-3 shadow-[0_35px_90px_-45px_rgba(13,44,25,0.8)] sm:p-4">
            <div className="bg-[#fbfaf5] p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase text-emerald-700">Analysis preview</p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">Q2 customer reviews</h2>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                  <FileSpreadsheet className="size-5" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  ["Reviews", "248"],
                  ["Themes", "12"],
                  ["High priority", "3"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-neutral-100 px-3 py-4">
                    <p className="text-xl font-bold text-neutral-950 sm:text-2xl">{value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase text-neutral-500 sm:text-xs">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {outcomes.map(({ label, value, icon: Icon }, index) => (
                  <div key={label} className="flex items-center gap-4 rounded-md border border-neutral-200 bg-white p-4">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-md ${index === 1 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900">{label}</p>
                      <p className="truncate text-xs text-neutral-500 sm:text-sm">{value}</p>
                    </div>
                    <ArrowUpRight className="size-4 text-neutral-400" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-900/10 bg-white/35">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 text-sm text-neutral-600 sm:grid-cols-3 sm:px-8 lg:px-12">
          <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-800" /> Structured, validated output</p>
          <p className="flex items-center gap-2"><MessageSquareText className="size-4 text-emerald-800" /> Evidence linked to reviews</p>
          <p className="flex items-center gap-2"><Sparkles className="size-4 text-emerald-800" /> Replaceable AI provider</p>
        </div>
      </section>
    </main>
  );
}
