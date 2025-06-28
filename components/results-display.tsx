"use client";

export function ResultsDisplay({ results }: { results: string }) {
  if (!results) return null;

  return (
    <div className="mt-4">
      <a
        href={results}
        download="Based_Report.pdf"
        className="text-blue-500 underline"
      >
        Download Your Based Report
      </a>
    </div>
  );
}