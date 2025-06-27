"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadForm } from "@/components/upload-form";
import { UploadStatus } from "@/components/upload-status";
import { ResultsDisplay } from "@/components/results-display";
import Link from "next/link";

export default function ProtectedPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [results, setResults] = useState<string>("");
  const [previousUploads, setPreviousUploads] = useState<any[]>([]);

  useEffect(() => {
    const fetchPreviousUploads = async () => {
      const supabase1 = createClient();
      const { data, error } = await supabase1
        .from("files") // Replace "files" with your table name
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching previous uploads:", error);
      } else {
        setPreviousUploads(data || []);
      }
    };

    fetchPreviousUploads();
  }, []);

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


      const supabase = createClient();

      // Fetch the authenticated user's session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.session?.user?.email) {
        console.error("User is not authenticated");
        setUploadStatus("You must be logged in to upload files.");
        return;
      }

      const userEmail = session.session.user.email;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads") // Replace "uploads" with your Supabase storage bucket name
        .upload(`public/${file.name}`, file);

      if (uploadError) {
        setUploadStatus(`Upload failed: ${uploadError.message}`);
        return;
      }

      // Optionally, store file metadata in the database
      const { error: dbError } = await supabase
        .from("files") // Replace "files" with your table name
        .insert([{ name: file.name, url: uploadData.path, user_email: userEmail }]);

      if (dbError) {
        setUploadStatus(`File uploaded, but failed to save metadata: ${dbError.message}`);
        return;
      }

      const fileContents = await file.text();

      console.log("fileContents:", fileContents); // Should be a string
      const response = await fetch("/api/process-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ fileContents: fileContents, userEmail: email }),
        body: JSON.stringify({ file: fileContents }),

      });

      if (!response.ok) {
        setUploadStatus("Failed to process the file.");
        return;
      }

      const result = await response.json();
      setResults(result.result);
      // setUploadStatus(result.emailSent ? "Processing complete! Email sent." : "Processing complete!");
      setUploadStatus("Processing complete!");

      const { data: filesData, error: filesError } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (!filesError) {
        setPreviousUploads(filesData || []);
      }
    } catch (err) {
      setUploadStatus(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Upload a File</h1>
      <UploadForm handleFileChange={handleFileChange} handleUpload={handleUpload} />
      <UploadStatus uploadStatus={uploadStatus} />
      <ResultsDisplay results={results} />

      <div className="w-full mt-8">
        <h2 className="text-xl font-bold mb-4">Previous Based Reports</h2>
        {previousUploads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousUploads.map((upload) => (
              <Link
                key={upload.id}
                href={`/protected/prev_upload?id=${upload.id}`} // Pass the `id` as a query parameter
                className="border p-4 rounded bg-gray-100 hover:bg-gray-200"
              >
                <p className="font-bold">File Name: {upload.name}</p>
                <p>Uploaded At: {new Date(upload.created_at).toLocaleString()}</p>
                <p>Click to view details</p>
              </Link>
            ))}
          </div>
        ) : (
          <p>No previous uploads found.</p>
        )}
      </div>
    </div>
  );
}
