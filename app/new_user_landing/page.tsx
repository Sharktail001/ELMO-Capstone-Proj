import React from "react";

{/* Article genre categories */}
const categories = [
  { name: "Breaking News & Current Events", emoji: "🌟" },
  { name: "Technology & Innovation", emoji: "🎮" },
  { name: "Science & Health", emoji: "🧪" },
  { name: "Travel", emoji: "✈️" },
  { name: "Entertainment & Media", emoji: "🎭" },
  { name: "Arts & Culture", emoji: "🎨" },
  { name: "Opinions & Deep Dives", emoji: "☘️" },
  { name: "Food", emoji: "🍕" },
  { name: "Sports & Lifestyle", emoji: "🏈" },
];

{/* Selcting article categories section */}
const ArticleSelection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-4">Hello, Name!</h1>

      {/* Subheader */}
      <h2 className="text-xl font-semibold text-center">
        What kind of articles are you interested in?
      </h2>
      <p className="text-md text-gray-500 italic text-center mb-6">
        Please select at least one
      </p>

      {/* Category Buttons */}
      <div className="w-full max-w-md flex flex-col gap-3">
        {categories.map((category, index) => (
          <button
            key={index}
            className="flex justify-between items-center w-full px-4 py-3 border rounded-lg shadow-md bg-white hover:bg-gray-100 transition duration-200 text-lg font-medium"
          >
            {category.name} <span className="text-xl">{category.emoji}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default ArticleSelection;