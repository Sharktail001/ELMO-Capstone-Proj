"use client"
import React, { useEffect } from "react";

export default function News() {
  useEffect(() => {
    // Fetch data from your API route
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        // Log the data in the browser console
        console.log("Fetched News Data:", data);
      })
      .catch((error) => console.error("Error fetching news:", error));
  }, []);

  return <div>Check the console for the news data!</div>;
}
