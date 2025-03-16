"use client";
import React, { useState } from "react";
import withAuth from "../../lib/withAuth";

function News() {
  const [query, setQuery] = useState(""); // Default query
  type Article = {
    title: string;
    content: string;
    url: string;
  };

  const [newsData, setNewsData] = useState<Article[]>([]);

  const fetchNews = async (searchQuery: string) => {
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      console.log("Fetched News Data:", data);
      setNewsData(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("query") as string;
    setQuery(searchQuery);
    fetchNews(searchQuery);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" name="query" placeholder="Search news..." />
        <button type="submit">Search</button>
      </form>
      <div>
        {newsData.length > 0 ? (
          newsData.map((article, index) => (
            <div key={index}>
              <h3>{article.title}</h3>
              <p>{article.content}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          ))
        ) : (
          <p>No news articles found.</p>
        )}
      </div>
    </div>
  );
}

export default withAuth(News);