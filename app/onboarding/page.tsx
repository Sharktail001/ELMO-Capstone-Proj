"use client"

import Link from "next/link";
import React from "react";
import { useAuth } from "../../lib/useAuth";
import { useState } from "react";
import withAuth from "../../lib/withAuth"

// Article genre categories
const categories = [
  { name: "Breaking News & Current Events", emoji: "🌟" }, //YES - General
  { name: "Technology & Innovation", emoji: "🎮" }, //YES
  { name: "Science & Health", emoji: "🧪" }, //YES
  { name: "Travel", emoji: "✈️" },
  { name: "Entertainment & Media", emoji: "🎭" }, //YES
  { name: "Arts & Culture", emoji: "🎨" },
  { name: "Opinions & Deep Dives", emoji: "☘️" },
  { name: "Food", emoji: "🍕" },
  { name: "Sports & Lifestyle", emoji: "🏈" }, //YES
];

//"science", "entertainment", "sports", "general", "health", "business", "technology"

{/* Selcting article categories section */}
function ReturningUsers() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Show a loading indicator while checking auth state
  }

  if (!user) {
    return null; // Redirect logic is handled by withAuth
  }

  return (
    <div className="flex flex-col h-full px-6 py-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-4">Hello, {user.name}!</h1>
      {/* Subheader */}
      <h2 className="text-xl font-semibold text-center mb-1">
        What kind of articles are you looking for today?
      </h2>
      <p className="text-md text-gray-600 italic text-center mb-6">
        Select at least one or click{" "}
        <Link href="/explore" className="text-blue-500 underline">
          here
        </Link>{" "}
        to go to the homepage.
      </p>

      {/* Category Buttons */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-3">
        {categories.map((category, index) => (
          <button
            key={index}
            className="flex justify-between items-center w-full px-4 py-3 border rounded-lg shadow-sm bg-white hover:bg-gray-100 transition duration-200 text-lg font-medium"
          >
            {category.name} <span className="text-xl">{category.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default withAuth(ReturningUsers);
