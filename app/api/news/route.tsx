import { NextResponse } from "next/server";
import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const query = "Apple"; // Change this to any topic

export async function GET() {
    try {
        // Fetch articles from NewsAPI
        const newsUrl = `https://newsapi.org/v2/everything?q=${query}&language=en&domains=cnn.com&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`;
        const newsResponse = await axios.get(newsUrl);
        const articles = newsResponse.data.articles.slice(0, 5); // Get the first 5 articles

        let extractedArticles = [];

        for (const article of articles) {
            try {
                console.log(`Fetching article: ${article.title}`);

                // Fetch full article HTML
                const articleResponse = await axios.get(article.url);

                // Convert HTML to a DOM object
                const dom = new JSDOM(articleResponse.data, { url: article.url });

                // Extract readable content
                let parsedArticle = new Readability(dom.window.document).parse();

                if (parsedArticle) {
                    extractedArticles.push({
                        title: article.title,
                        url: article.url,
                        content: parsedArticle.textContent.trim(),
                    });
                } else {
                    console.log(`Failed to extract content for: ${article.title}`);
                }
            } catch (err) {
                console.error(`Error fetching article HTML: ${article.url}`, (err as any).message);
            }
        }

        return NextResponse.json(extractedArticles);
    } catch (error) {
        console.error("Error fetching news articles:", (error as Error).message);
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}
