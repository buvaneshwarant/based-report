"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [results, setResults] = useState<string>("");

    const authh = async () => {
        const supabase = await createClient();

        const user = await supabase.auth.getUser();
        if (!user) {
            console.error("User is not authenticated");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus("Please select a file to upload.");
            return;
        }
        setUploadStatus("Uploading...");
        try {
            const supabase = await createClient();
            const user = await supabase.auth.getUser();
            if (!user) {
                console.error("User is not authenticated");
                setUploadStatus("You must be logged in to upload files.");
                return;
            }
            const { data, error } = await supabase.storage
                .from("uploads") // Replace "uploads" with your Supabase storage bucket name
                .upload(`public/${file.name}`, file);

            if (error) {
                setUploadStatus(`Upload failed: ${error.message}`);
                return;
            }

            // Optionally, store file metadata in the database
            const { error: dbError } = await supabase
                .from("files") // Replace "files" with your table name
                .insert([{ name: file.name, url: data.path }]);

            if (dbError) {
                setUploadStatus(`File uploaded, but failed to save metadata: ${dbError.message}`);
                return;
            }

            setUploadStatus("File uploaded successfully!");

            // Read the file contents
            const fileContents = await file.text();

            // Send the file contents to OpenAI API
            const response = await fetch("/api/process-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileContents }),
            });

            if (!response.ok) {
                setUploadStatus("Failed to process the file.");
                return;
            }

            const result = await response.json();
            setResults(result.result); // Assuming the API returns results in `result`
            setUploadStatus("Processing complete!");

        } catch (err) {
            setUploadStatus(`An error occurred: ${err.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Upload a File</h1>

            <input
                type="file"
                onChange={handleFileChange}
                className="border p-2"
            />
            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Upload
            </button>
            {uploadStatus && <p className="text-red-500">{uploadStatus}</p>}
            {results && (
    <div className="mt-4 p-4 border rounded bg-gray-100 w-full max-w-4xl">
        <h2 className="text-blue-500 font-bold">Results:</h2>
        <pre className="text-blue-500 overflow-auto max-w-full whitespace-pre-wrap">
            {results}
        </pre>
    </div>
            )}
        </div>
    );
}