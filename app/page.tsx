// import { Button } from "@/components/ui/button";
// import { Sparkles, Flame, Laugh, Upload } from "lucide-react";
// import Link from "next/link";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 animate-gradient px-6 py-10">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center max-w-7xl mx-auto mb-10">
//         <div className="text-3xl font-extrabold text-rose-600 tracking-tight">
//           Based Report
//         </div>
//         <div className="space-x-6 text-lg font-medium">
//           <Link href="#features" className="hover:text-rose-500">Features</Link>
//           <Link href="#reviews" className="hover:text-rose-500">Reviews</Link>
//           <Link href="/analyze">
//             <Button className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-2">
//               Try Now
//             </Button>
//           </Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <div className="text-center max-w-4xl mx-auto">
//         <h1 className="text-6xl font-black text-gray-900 leading-tight mb-4">
//           🔥 Roast Yourself & Your Friends
//         </h1>
//         <p className="text-2xl text-gray-700 mb-8">
//           Upload your group chat. Let our AI spill the tea, drop the jokes, and uncover the chaos.
//         </p>
//         <Link href="/analyze">
//           <Button className="text-lg px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-xl hover:scale-105 transition">
//             <Upload className="mr-2" /> Upload Chat Now
//           </Button>
//         </Link>
//       </div>

//       {/* Features */}
//       <div id="features" className="max-w-6xl mx-auto mt-24 grid md:grid-cols-3 gap-10">
//         <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition">
//           <Flame className="text-red-500 w-10 h-10 mb-4" />
//           <h3 className="text-xl font-bold mb-2">Who's the Main Character?</h3>
//           <p className="text-gray-600">
//             See who's the loudest, the ghost, or the drama king/queen in your group chat.
//           </p>
//         </div>
//         <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition">
//           <Laugh className="text-yellow-500 w-10 h-10 mb-4" />
//           <h3 className="text-xl font-bold mb-2">Funniest Messages</h3>
//           <p className="text-gray-600">
//             We find and highlight the most unhinged, laugh-out-loud texts you've all forgotten.
//           </p>
//         </div>
//         <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition">
//           <Sparkles className="text-purple-500 w-10 h-10 mb-4" />
//           <h3 className="text-xl font-bold mb-2">Mood & Vibes</h3>
//           <p className="text-gray-600">
//             Analyze sentiment over time—discover love, beef, dead chats, and group glow-ups.
//           </p>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div id="reviews" className="max-w-4xl mx-auto mt-28 text-center">
//         <h2 className="text-4xl font-extrabold mb-6">What People Are Saying</h2>
//         <div className="grid md:grid-cols-2 gap-8">
//           <div className="bg-white rounded-2xl shadow-md p-6 text-left">
//             <p className="italic text-gray-700 mb-2">
//               "This exposed my group chat in the funniest way. I found out I'm the villain 😂."
//             </p>
//             <p className="text-sm font-semibold text-rose-600">— Alex D.</p>
//           </div>
//           <div className="bg-white rounded-2xl shadow-md p-6 text-left">
//             <p className="italic text-gray-700 mb-2">
//               "We uploaded our college chat. AI called out the simp, the ghoster, and the drama queen. Spot on."
//             </p>
//             <p className="text-sm font-semibold text-rose-600">— Jamie L.</p>
//           </div>
//         </div>
//       </div>

//       {/* CTA Footer */}
//       <div className="mt-32 text-center">
//         <p className="text-xl font-semibold text-gray-800 mb-6">
//           Ready to see your chat in a whole new (hilarious) light?
//         </p>
//         <Link href="/analyze">
//           <Button className="px-10 py-4 text-lg rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg">
//             Roast My Group Chat
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { Flame, Laugh, Sparkles, Upload, Mail, CreditCard } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 animate-gradient px-6 py-10">
      {/* Navbar */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-10">
        <div className="text-3xl font-extrabold text-rose-600 tracking-tight">
          Based Report
        </div>
        <div className="space-x-6 text-lg font-medium">
          <Link href="#features" className="hover:text-rose-500">Features</Link>
          <Link href="#pricing" className="hover:text-rose-500">Pricing</Link>
          <Link href="#reviews" className="hover:text-rose-500">Reviews</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-black text-gray-900 leading-tight mb-4">
          🔥 Roast Yourself & Your Friends
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Upload your group chat. Let our AI spill the tea, drop the jokes, and uncover the chaos.
        </p>
        <a href="#pricing">
          <Button className="text-lg px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-xl hover:scale-105 transition">
            <Upload className="mr-2" /> Get Started
          </Button>
        </a>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto mt-24 grid md:grid-cols-3 gap-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition">
          <Flame className="text-red-500 w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Who's the Main Character?</h3>
          <p className="text-gray-600">
            See who's the loudest, the ghost, or the drama king/queen in your group chat.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition">
          <Laugh className="text-yellow-500 w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Funniest Messages</h3>
          <p className="text-gray-600">
            We find and highlight the most unhinged, laugh-out-loud texts you've all forgotten.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition">
          <Sparkles className="text-purple-500 w-10 h-10 mb-4" />
          <h3 className="text-xl font-bold mb-2">Mood & Vibes</h3>
          <p className="text-gray-600">
            Analyze sentiment over time—discover love, beef, dead chats, and group glow-ups.
          </p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div id="pricing" className="max-w-5xl mx-auto mt-32 text-center">
        <h2 className="text-4xl font-extrabold mb-6">Choose Your Roast Level</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Basic Plan */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition border border-rose-200">
            <h3 className="text-2xl font-bold text-rose-600 mb-2">Roast Me Light</h3>
            <p className="text-gray-600 mb-4">For solo chats or a curious first burn 🔥</p>
            <p className="text-3xl font-bold mb-4">$5</p>
            <ul className="text-gray-600 mb-6 space-y-1">
              <li>✔ 1 Chat Upload</li>
              <li>✔ Email Report</li>
              <li>✔ AI Roast & Graphs</li>
            </ul>
            <a href="/analyze">
              <Button className="w-full rounded-full bg-rose-600 text-white">Choose Plan</Button>
            </a>
          </div>

          {/* Plus Plan */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition border border-yellow-300">
            <h3 className="text-2xl font-bold text-yellow-600 mb-2">Meme Overload</h3>
            <p className="text-gray-600 mb-4">For couples, roommates, group clowns 😂</p>
            <p className="text-3xl font-bold mb-4">$12</p>
            <ul className="text-gray-600 mb-6 space-y-1">
              <li>✔ 3 Chat Uploads</li>
              <li>✔ Priority Email Delivery</li>
              <li>✔ Extra Insight Layers</li>
            </ul>
            <a href="/analyze">
              <Button className="w-full rounded-full bg-yellow-500 text-white">Choose Plan</Button>
            </a>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition border border-purple-300">
            <h3 className="text-2xl font-bold text-purple-600 mb-2">Group Chat God</h3>
            <p className="text-gray-600 mb-4">For influencers, large friend groups, or chaotic genius 👑</p>
            <p className="text-3xl font-bold mb-4">$25</p>
            <ul className="text-gray-600 mb-6 space-y-1">
              <li>✔ 10 Chat Uploads</li>
              <li>✔ VIP Processing</li>
              <li>✔ Custom Meme Report</li>
            </ul>
            <a href="/analyze">
              <Button className="w-full rounded-full bg-purple-600 text-white">Choose Plan</Button>
            </a>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div id="reviews" className="max-w-4xl mx-auto mt-28 text-center">
        <h2 className="text-4xl font-extrabold mb-6">What People Are Saying</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-left">
            <p className="italic text-gray-700 mb-2">
              "This exposed my group chat in the funniest way. I found out I'm the villain 😂."
            </p>
            <p className="text-sm font-semibold text-rose-600">— Alex D.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-left">
            <p className="italic text-gray-700 mb-2">
              "We uploaded our college chat. AI called out the simp, the ghoster, and the drama queen. Spot on."
            </p>
            <p className="text-sm font-semibold text-rose-600">— Jamie L.</p>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="mt-32 text-center">
        <p className="text-xl font-semibold text-gray-800 mb-6">
          Ready to upload and unleash the roast?
        </p>
        <Link href="/analyze">
          <Button className="px-10 py-4 text-lg rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg">
            <Mail className="mr-2" /> Email Me The Report
          </Button>
        </Link>
      </div>
    </div>
  );
}