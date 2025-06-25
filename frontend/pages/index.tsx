"use client";

import Link from "next/link";
import { LogIn, UserPlus, Sparkles, BarChart2, Brain, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="bg-white shadow-2xl rounded-3xl px-6 sm:px-12 py-10 max-w-3xl w-full transition-all">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-5xl mr-3 animate-pulse">🧠</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            AI Task Manager
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
          Automate your task creation, tracking, and prioritization using AI.
          Stay organized, save time, and get more done — effortlessly.
        </p>

        {/* CTA Buttons with redirect */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/sign-in?redirect_url=/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow hover:scale-105 transition-transform"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </Link>
          <Link
            href="/sign-up?redirect_url=/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow hover:scale-105 transition-transform"
          >
            <UserPlus className="w-5 h-5" />
            Sign Up
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 p-6 sm:p-8 rounded-xl border text-left space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Why Choose AI Task Manager?</h2>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start gap-2">
              <Sparkles className="text-indigo-500 w-5 h-5 mt-1" />
              <span>Auto-generate tasks based on your goals</span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart2 className="text-blue-500 w-5 h-5 mt-1" />
              <span>Track progress and prioritize with ease</span>
            </li>
            <li className="flex items-start gap-2">
              <Brain className="text-purple-500 w-5 h-5 mt-1" />
              <span>Get smart suggestions using AI insights</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="text-emerald-500 w-5 h-5 mt-1" />
              <span>Secure and user-friendly experience with Clerk Auth</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} AI Task Manager. All rights reserved.
      </footer>
    </main>
  );
}
