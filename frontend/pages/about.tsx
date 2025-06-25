// pages/about.tsx
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About AI Task Manager</h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          The <span className="text-blue-400 font-semibold">AI Task Manager</span> is a powerful, intelligent productivity platform designed to
          automate your workflow, help you prioritize effectively, and optimize your time.
        </p>

        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          By using state-of-the-art AI, we empower individuals and teams to create, manage,
          and track tasks with ease. Our goal is to minimize manual effort and let you focus
          on what matters most.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>✨ AI-powered task generation and smart suggestions</li>
          <li>📅 Group tasks by topic, date, and completion status</li>
          <li>✅ Effortless toggling between done and pending tasks</li>
          <li>👤 Secure user management with Clerk authentication</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">Our Mission</h2>
        <p className="text-lg text-gray-300 mb-10">
          To create a seamless productivity experience that blends AI intelligence with a delightful user experience—helping you get more done with less effort.
        </p>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center mt-10">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/tasks"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            View Task List
          </Link>
        </div>
      </div>
    </div>
  );
}
