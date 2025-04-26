"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/useAuth";
import withAuth from "../../lib/withAuth";
import { updateUser } from "../../lib/amplifyConfig";

// Article genre categories
const categories = [
  { name: "Breaking News & Current Events", emoji: "🌟", value: "general" }, //YES - General
  { name: "Technology & Innovation", emoji: "🎮", value: "technology" }, //YES
  { name: "Science", emoji: "🧪", value: "science" }, //YES
  { name: "Health & Wellness", emoji: "💊", value: "health" }, //YES
  { name: "Travel", emoji: "✈️", value: "travel" },
  { name: "Entertainment & Media", emoji: "🎭", value: "entertainment" }, //YES
  { name: "Arts & Culture", emoji: "🎨", value: "art" },
  { name: "Opinions & Deep Dives", emoji: "☘️", value: "min" },
  { name: "Food", emoji: "🍕", value: "food" },
  { name: "Sports & Lifestyle", emoji: "🏈", value: "sports" }, //YES
];

function ReturningUsers() {
  const { user, loading } = useAuth();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.preferences) {
      setSelectedPreferences(user.preferences);
    }
  }, [user]);

  const handleCategoryClick = async (categoryName: string) => {
    if (!user) return;

    const updatedPreferences = selectedPreferences.includes(categoryName)
      ? selectedPreferences.filter((pref) => pref !== categoryName) // Remove preference
      : [...selectedPreferences, categoryName]; // Add preference

    setSelectedPreferences(updatedPreferences);

    try {
      await updateUser(user.userId, updatedPreferences);
      console.log("Preferences updated successfully");
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  // Handle loading and no-user states within the return statement
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
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
            onClick={() => handleCategoryClick(category.value)}
            className={`flex justify-between items-center w-full px-4 py-3 border rounded-lg shadow-sm transition duration-200 text-lg font-medium ${
              selectedPreferences.includes(category.value)
                ? "bg-blue-100 border-blue-500"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {category.name} <span className="text-xl">{category.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default withAuth(ReturningUsers);
