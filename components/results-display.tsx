"use client";

export function ResultsDisplay({ results }: { results: string }) {
    return results ? (
        <div className="mt-4 p-4 border rounded bg-gray-100 w-full max-w-4xl">
            <h2 className="text-blue-500 font-bold">Results:</h2>
            <pre className="text-blue-500 overflow-auto max-w-full whitespace-pre-wrap">
                {results}
            </pre>
        </div>
    ) : null;
}