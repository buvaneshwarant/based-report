"use client";

export function UploadForm({
    handleFileChange,
    handleUpload,
}: {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleUpload: () => void;
}) {
    return (
        <div className="flex flex-col items-center gap-4">
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
        </div>
    );
}