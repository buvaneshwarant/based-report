import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
export default function PricingPage() {

  // export default function GroupTextAnalyzer() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Group Text Message Analyzer
        </h1>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload Your Group Chat</h2>
          <p className="text-gray-600 mb-4">
            Supported formats: .txt, .json, .csv (WhatsApp, iMessage, Telegram export)
          </p>
          <input type="file" className="file-input file-input-bordered w-full" />
        </div>

        {/* Analysis Controls */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Choose What to Analyze</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="checkbox" />
              <span>Top contributors</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="checkbox" />
              <span>Message frequency</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="checkbox" />
              <span>Sentiment analysis</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="checkbox" />
              <span>Funniest messages</span>
            </label>
          </div>
          <button className="btn btn-primary mt-6">Analyze Chat</button>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <div className="text-gray-700">
            <p className="italic">Analysis results will appear here after processing...</p>
          </div>
        </div>
      </div>
    </div>
  );
//}


  // return (
  //   <main className="min-h-screen flex flex-col items-center bg-white text-black">
  //     <header className="w-full bg-gray-100 py-6">
  //       <div className="max-w-5xl mx-auto flex justify-between items-center px-6">
  //         <h1 className="text-3xl font-bold">Based Report</h1>
  //         <nav className="flex gap-6">
  //           <AuthButton />
  //         </nav>
  //       </div>
  //     </header>

  //     <section id="hero" className="flex flex-col items-center text-center py-20 px-6">
  //       <h2 className="text-4xl font-bold mb-4">Roast Yourself and Your Friends</h2>
  //       <p className="text-lg max-w-2xl">
  //         Based Report doesn’t pull out - just the truth, hard, honest, and totally unfiltered.
  //       </p>
  //       {/* Make sure gigachad.png is in the /public directory */}
  //       <img
  //         src="/gigachad.png"
  //         width={500}
  //         height={300}
  //         className="rounded-lg shadow-lg"
  //         alt="Gigachad"
  //       />
  //     </section>

  //     <section id="pricing" className="w-full bg-gray-100 py-20">
  //       <div className="max-w-5xl mx-auto text-center">
  //         <h2 className="text-3xl font-bold mb-6">Pricing</h2>
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //           <div className="bg-gray-200 p-6 rounded">
  //             <h3 className="text-xl font-bold mb-4">Free</h3>
  //             <p className="mb-4">Get a taste of the roast for free.</p>
  //             <p className="text-lg font-bold">$0/month</p>
  //           </div>
  //           <div className="bg-gray-200 p-6 rounded">
  //             <h3 className="text-xl font-bold mb-4">Pro</h3>
  //             <p className="mb-4">Unlimited roasts and deeper insights.</p>
  //             <p className="text-lg font-bold">$10/month</p>
  //           </div>
  //           <div className="bg-gray-200 p-6 rounded">
  //             <h3 className="text-xl font-bold mb-4">Ultimate</h3>
  //             <p className="mb-4">Roast your entire friend group and get advanced analytics.</p>
  //             <p className="text-lg font-bold">$25/month</p>
  //           </div>
  //         </div>
  //       </div>
  //     </section>

  //     <section id="features" className="py-20 px-6">
  //       <div className="max-w-5xl mx-auto text-center">
  //         <h2 className="text-3xl font-bold mb-6">Features</h2>
  //         <ul className="list-disc list-inside text-left mx-auto max-w-3xl">
  //           <li className="mb-4">Personalized roasts tailored to your personality.</li>
  //           <li className="mb-4">Roast your friends and see what they're all about.</li>
  //           <li className="mb-4">Advanced analytics to see how you rank among your peers.</li>
  //           <li className="mb-4">Share your roasts on social media for maximum laughs.</li>
  //         </ul>
  //       </div>
  //     </section>

  //     <footer className="w-full bg-gray-100 py-6">
  //       <div className="max-w-5xl mx-auto text-center">
  //         <p className="text-sm">&copy; 2025 Based Report. All rights reserved.</p>
  //       </div>
  //     </footer>
  //   </main>
  // );
}