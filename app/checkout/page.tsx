"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileSelectionCard() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("File must be less than 20MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleGenerateClick = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Step 1: Create Stripe checkout session
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "basic",
          email: "anonymous@basedreport.com",
          filename: file.name
        }),
      });

      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setError("Failed to initiate payment. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white border rounded-xl shadow p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Generate your Based Report</h2>

        <label className="block border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center space-y-2">
            <UploadCloud className="w-8 h-8 text-gray-400" />
            <p className="text-gray-700 font-medium">
              Drop your conversation here or click to select file
            </p>
            <p className="text-sm text-gray-500">
              Supports JSON exports from Messenger, Telegram, and WhatsApp, file size up to 20MB
            </p>
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </div>
        </label>

        {file && (
          <p className="mt-3 text-sm text-gray-600">Selected: {file.name}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-6">
          <Button
            disabled={!file || loading}
            onClick={handleGenerateClick}
            className="w-full text-lg py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow hover:from-indigo-600 hover:to-blue-600"
            type="button"
          >
            {loading ? "Redirecting..." : "Generate for $1"}
          </Button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Logged in as <span className="text-blue-600 font-medium">Anonymous</span>
        </p>
      </div>
    </div>
  );
}
