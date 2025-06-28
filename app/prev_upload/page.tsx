"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function ViewDetailsPageContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("id");
  const [fileDetails, setFileDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileDetails = async () => {
      if (!fileId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("files") // Replace "files" with your table name
        .select("*")
        .eq("id", fileId)
        .single();

      if (error) {
        console.error("Error fetching file details:", error);
      } else {
        setFileDetails(data);
      }
      setLoading(false);
    };

    fetchFileDetails();
  }, [fileId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!fileDetails) {
    return <p>File not found.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">File Details</h1>
      <div className="border p-4 rounded bg-gray-100 w-full max-w-md">
        <p className="font-bold">File Name: {fileDetails.name}</p>
        <p>Uploaded At: {new Date(fileDetails.created_at).toLocaleString()}</p>
        {fileDetails.report_url && (
          <a
            href={`https://jknlwrzslnrkzfeuintd.supabase.co/storage/v1/object/public/uploads/${fileDetails.report_url}`} // Replace `your-supabase-url` with your actual Supabase URL
            download={`${fileDetails.name.replace(/\.[^/.]+$/, "")}-report.pdf`}
            className="text-blue-500 underline mt-4 block"
          >
            Download Report
          </a>
        )}
      </div>
    </div>
  );
}

export default function PrevUploadPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ViewDetailsPageContent />
    </Suspense>
  );
}