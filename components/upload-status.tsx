"use client";

export function UploadStatus({ uploadStatus }: { uploadStatus: string }) {
    return uploadStatus ? <p className="text-red-500">{uploadStatus}</p> : null;
}