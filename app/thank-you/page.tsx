'use client';

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-700 mb-2">You're All Set!</h1>
        <p className="text-gray-700 mb-6">
          Thanks for uploading your chat. We’re analyzing it with the most brutally honest AI.
          You’ll receive your Based Report in your inbox shortly.
        </p>

        <p className="text-sm text-gray-500 mb-4">
          If you don’t see it within a few minutes, check your spam or promotions folder.
        </p>

        <Link href="/" className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700">
          Upload Another Chat
        </Link>
      </div>
    </div>
  );
}
