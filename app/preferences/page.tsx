"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/useAuth";
import withAuth from "../../lib/withAuth";
import { updateUser } from "../../lib/amplifyConfig";

// Article genre categories
const categories = [
  { name: "Breaking News & Current Events", emoji: "🌟", value: "general" },
  { name: "Technology & Innovation", emoji: "🎮", value: "technology" },
  { name: "Science", emoji: "🧪", value: "science" },
  { name: "Health & Wellness", emoji: "💊", value: "health" },
  { name: "Travel", emoji: "✈️", value: "travel" },
  { name: "Entertainment & Media", emoji: "🎭", value: "entertainment" },
  { name: "Arts & Culture", emoji: "🎨", value: "art" },
  { name: "Opinions & Deep Dives", emoji: "☘️", value: "min" },
  { name: "Food", emoji: "🍕", value: "food" },
  { name: "Sports & Lifestyle", emoji: "🏈", value: "sports" },
];

function ReturningUsers() {
  const { user, loading } = useAuth();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  useEffect(() => {
    if (user?.preferences && Array.isArray(user.preferences)) {
      setSelectedPreferences(user.preferences);
    } else {
      setSelectedPreferences([]);
    }
  }, [user]);

  const handleCategoryClick = async (categoryValue: string) => {
    if (!user) return;

    const updatedPreferences = selectedPreferences.includes(categoryValue)
      ? selectedPreferences.filter((pref) => pref !== categoryValue)
      : [...selectedPreferences, categoryValue];

    setSelectedPreferences(updatedPreferences);

    try {
      await updateUser(user.userId, updatedPreferences);
      console.log("Preferences updated successfully");
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-3 h-3 bg-[#FF7E77] rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="flex flex-col items-center px-4 md:px-10 py-6 min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
      <div className="w-full max-w-2xl px-6 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Hello, {user.name}!
        </h1>
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

        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              aria-pressed={selectedPreferences.includes(category.value)}
              className={`flex justify-between items-center px-4 py-3 border rounded-lg shadow-sm transition duration-200 text-lg font-medium ${
                selectedPreferences.includes(category.value)
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {category.name}
              <span className="text-xl">{category.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default withAuth(ReturningUsers);
