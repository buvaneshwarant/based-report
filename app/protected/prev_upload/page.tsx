"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UploadDetailsPage() {
    const [uploadDetails, setUploadDetails] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // Get the `id` from query parameters

    useEffect(() => {
        if (!id) {
            console.error("No ID provided in query parameters.");
            router.push("/protected"); // Redirect to the main page if no ID is provided
            return;
        }

        const fetchUploadDetails = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("files") // Replace "files" with your table name
                .select("*")
                .eq("id", id) // Fetch the upload with the specific ID
                .single();

            if (error) {
                console.error("Error fetching upload details:", error);
                router.push("/protected"); // Redirect to the main page if the upload is not found
            } else {
                setUploadDetails(data);
            }
        };

        fetchUploadDetails();
    }, [id, router]);

    if (!uploadDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Upload Details</h1>
            <div className="border p-4 rounded bg-gray-100 w-full max-w-3xl">
                <p className="font-bold">File Name: {uploadDetails.name}</p>
                <p>Uploaded At: {new Date(uploadDetails.created_at).toLocaleString()}</p>
                <p>Result:</p>
                <pre className="bg-gray-200 p-4 rounded">{uploadDetails.result || "No result available"}</pre>
            </div>
        </div>
    );
}
