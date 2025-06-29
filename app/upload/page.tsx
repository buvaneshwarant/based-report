"use client";

import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function FileSelectionCard() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get("session_id");
    if (sid) setSessionId(sid);
  }, []);

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

  const handleUpload = async () => {
    if (!file || !sessionId || !email || !email.includes("@")) {
      setError("Please select a file and enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // pre step
      // Step 1: Record payment to DB
      await fetch("/api/record-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          email,
          status: "paid"
        })
      });

      // Step 1: Get signed URL
      const presignRes = await fetch("/api/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, sessionId })
      });
      const { url } = await presignRes.json();
      if (!url) throw new Error("Failed to get signed URL");

      // Step 2: Upload file to Supabase
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });

      // Step 3: Save upload info to DB
      await fetch("/api/record-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          email,
          filePath: `uploads/${sessionId}/${file.name}`,
          status: "uploaded"
        })
      });

      // Step 3: Trigger processing
      await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          email,
          filePath: `uploads/${sessionId}/${file.name}`
        })
      });

      // Step 6: Mark upload complete and delete file
      await fetch("/api/complete-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          filePath: `uploads/${sessionId}/${file.name}`
        })
      });

      setUploadComplete(true);
      // pause for a bit before redirecting
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Step 4: Redirect to thank you page
      router.push("/thank-you");
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

        {loading && (
          <p className="text-yellow-600 font-medium mb-4">
            Uploading... Please don't close or refresh the browser.
          </p>
        )}

        <label className="block border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center space-y-2">
            <UploadCloud className="w-8 h-8 text-gray-400" />
            <p className="text-gray-700 font-medium">
              Drop your conversation here or click to select file
            </p>
            <p className="text-sm text-gray-500">
              Supports Messenger, Telegram, and WhatsApp exports (max 20MB)
            </p>
            <input
              type="file"
              accept=".txt,.json,.csv"
              hidden
              onChange={handleFileChange}
            />
          </div>
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          className="mt-4 w-full px-3 py-2 rounded-md border border-gray-400 bg-gray-200 text-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {file && (
          <p className="mt-3 text-sm text-gray-600">Selected: {file.name}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-6">
          <Button
            disabled={!file || loading || !sessionId}
            onClick={handleUpload}
            className="w-full text-lg py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow hover:from-indigo-600 hover:to-blue-600"
            type="button"
          >
            {loading ? "Uploading..." : "Upload & Generate Report"}
          </Button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Logged in as <span className="text-blue-600 font-medium">Anonymous</span> ・
          <span className="ml-1 inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
            1 REPORTS REMAINING
          </span>
        </p>
      </div>
    </div>
  );
}
