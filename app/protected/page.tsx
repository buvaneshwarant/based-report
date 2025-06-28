"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadForm } from "@/components/upload-form";
import { UploadStatus } from "@/components/upload-status";
import { ResultsDisplay } from "@/components/results-display";
import Link from "next/link";
import { jsPDF } from "jspdf";

async function hasReachedUploadLimit(userEmail: string): Promise<boolean> {
  const supabase = createClient();

  // Fetch the user's tier from the users table
  const { data: userData, error: userError } = await supabase
    .from("user_profiles")
    .select("tier")
    .eq("email", userEmail)
    .single();

  if (userError || !userData?.tier) {
    console.error("Error fetching user tier:", userError);
    return true;
  }

  // Define limits per tier
  const tierLimits: Record<string, number> = {
    free: 1,
    pro: 20,
    ultimate: 100,
  };

  const userTier = userData.tier.toLowerCase();
  const uploadLimit = tierLimits[userTier] ?? 0;

  // Count user's uploads
  const { count, error: countError } = await supabase
    .from("files")
    .select("*", { count: "exact", head: true })
    .eq("user_email", userEmail);

  if (countError) {
    console.error("Error counting uploads:", countError);
    return false;
  }

  if (count === null) {
    console.error("Count is null, defaulting to 0 uploads.");
    return false; // Default to not reached limit if count is null
  }

  return count >= uploadLimit;
}

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

  // This function handles the file upload process
  // It checks if the user is authenticated, verifies their upload limit,
  // uploads the file to Supabase storage, and processes the file contents.
  // It also updates the upload status and results state variables.
  // If the upload is successful, it fetches the previous uploads and updates the state.
  // If any errors occur, it sets the upload status accordingly.
  // It also handles the case where the user has reached their upload limit.
  // The function uses the Supabase client to interact with the database and storage.
  // The file contents are processed by sending a POST request to the /api/process-file endpoint
  // with the file contents in the request body.
  // The results of the processing are stored in the results state variable.
  // The previous uploads are fetched from the database and displayed on the page.
  // The function is called when the user clicks the "Upload" button in the UploadForm component.
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    setUploadStatus("Uploading...");
    try {
      const supabase = createClient();

      // Step 1: Fetch the authenticated user's session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.session?.user?.email) {
        console.error("User is not authenticated");
        setUploadStatus("You must be logged in to upload files.");
        return;
      }

      const userEmail = session.session.user.email;

      // Step 2: Check if the user has reached their upload limit
      const limit = await hasReachedUploadLimit(userEmail);
      if (limit) {
        setUploadStatus("You have reached your upload limit.");
        return;
      }

      // Step 3: Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads") // Replace "uploads" with your Supabase storage bucket name
        .upload(`public/${file.name}`, file, { upsert: true });

      if (uploadError) {
        setUploadStatus(`Upload failed: ${uploadError.message}`);
        return;
      }

      // Step 4: Store file metadata in the database
      const { data: fileMetadata, error: dbError } = await supabase
        .from("files") // Replace "files" with your table name
        .insert([{ name: file.name, url: uploadData.path, user_email: userEmail }])
        .select("*")
        .single();

      if (dbError || !fileMetadata) {
        setUploadStatus(`File uploaded, but failed to save metadata: ${dbError?.message}`);
        return;
      }

      // Step 5: Process the file contents
      const fileContents = await file.text();
      const response = await fetch("/api/process-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: fileContents }),
      });

      if (!response.ok) {
        setUploadStatus("Failed to process the file.");
        return;
      }

      // Step 6: Handle the response from the processing endpoint
      const result = await response.json();
      const reportContent = result.result;

      // Step 7: Generate a PDF with the results
      const pdf = new jsPDF();
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text("Based Report Results", 10, 10);
      pdf.text(reportContent, 10, 20);

      // Step 8: Upload the generated report to Supabase storage
      const pdfBlob = pdf.output("blob");
      const reportPath = `public/reports/${file.name.replace(/\.[^/.]+$/, "")}-report.pdf`; // Generate a unique path for the report
      const { data: reportData, error: reportError } = await supabase.storage
        .from("uploads") // Replace "uploads" with your Supabase storage bucket name
        .upload(reportPath, pdfBlob, { upsert: true });

      if (reportError) {
        setUploadStatus(`Report generated, but failed to save: ${reportError.message}`);
        return;
      }

      // Step 9: Update the file metadata with the report URL
      const { error: updateError } = await supabase
        .from("files")
        .update({ report_url: reportData.path }) // Add the report URL to the file metadata
        .eq("id", fileMetadata.id);

      if (updateError) {
        setUploadStatus(`Report saved, but failed to update metadata: ${updateError.message}`);
        return;
      }

      setUploadStatus("Processing complete! Report saved successfully.");

      // Step 10: Fetch previous uploads to update the state
      const { data: filesData, error: filesError } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (!filesError) {
        setPreviousUploads(filesData || []);
      }
    } catch (err) {
      if (err instanceof Error) {
        setUploadStatus(`An error occurred: ${err.message}`);
      } else {
        setUploadStatus("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Upload your text file</h1>
      <UploadForm handleFileChange={handleFileChange} handleUpload={handleUpload} />
      <UploadStatus uploadStatus={uploadStatus} />
      <ResultsDisplay results={results} />

      <div className="w-full mt-8">
        <h2 className="text-xl font-bold mb-4">Previous Based Reports</h2>
        {previousUploads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousUploads.map((upload) => (
              <div key={upload.id} className="border p-4 rounded bg-gray-100 hover:bg-gray-200">
                <p className="font-bold">File Name: {upload.name}</p>
                <p>Uploaded At: {new Date(upload.created_at).toLocaleString()}</p>
                <Link href={`/prev_upload?id=${upload.id}`} className="text-blue-500 underline">
                  View Details
                </Link>
                {upload.report_url && (
                  <a
                    href={`https://jknlwrzslnrkzfeuintd.supabase.co/storage/v1/object/public/uploads/${upload.report_url}`} // Replace `your-supabase-url` with your actual Supabase URL
                    download={`${upload.name.replace(/\.[^/.]+$/, "")}-report.pdf`}
                    className="text-blue-500 underline ml-4"
                  >
                    Download Report
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No previous uploads found.</p>
        )}
      </div>
    </div>
  );
}
