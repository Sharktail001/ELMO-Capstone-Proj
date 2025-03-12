import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

// This is the directory where your articles are stored
const ARTICLES_DIR = path.join(process.cwd(), "articles");

// Default model to use
const AI_MODEL = "deepseek-r1:7b";

export const MARKDOWN_INSTRUCTIONS = `
Follow these guidelines to ensure clarity, readability, and consistency:

## General Structure:
1. **Title**: Use a single \`#\` for the main title.
2. **Introduction**: Provide an overview of the topic, briefly explaining what the article will cover.
3. **Headings and Subheadings**:
   - Use \`##\` for main sections.
   - Use \`###\` for subsections if needed.
4. **Bullet Points & Lists**:
   - Use \`-\` or \`*\` for unordered lists.
   - Use \`1., 2., 3.\` for ordered steps or lists.
5. **Code Blocks (if applicable)**:
   - Use triple backticks (\`\`\`) for code snippets.
   - Specify the language for syntax highlighting (e.g., \`\`\`typescript).
6. **Bold & Italics**:
   - Use \`**bold**\` for emphasis.
   - Use \`*italics*\` for minor emphasis.
7. **Blockquotes**:
   - Use \`>\` for quotes or highlighting important notes.
8. **Links**:
   - Use \`[text](URL)\` format for hyperlinks.

## Example Markdown Structure:
\`\`\`markdown
# The Future of AI in Web Development

## Introduction
Artificial Intelligence (AI) is revolutionizing web development by enhancing automation, improving user experience, and optimizing efficiency.

## How AI is Changing Web Development
### 1. AI-Powered Code Generation
AI tools like GitHub Copilot and ChatGPT assist developers in writing efficient code.

### 2. Enhanced User Experience
- Chatbots provide real-time support.
- Personalized content recommendations improve engagement.

### 3. Automated Testing
AI-powered testing frameworks help detect bugs faster.

## Conclusion
AI is shaping the future of web development, making it more efficient and user-centric.

> "The future of AI in web development is bright, with endless possibilities for innovation."

For more insights, visit [OpenAI](https://openai.com).
\`\`\`

## Output Requirements:
- Maintain proper Markdown formatting.
- Ensure clarity and logical flow.
- Avoid unnecessary verbosity.
- Follow best practices for structuring technical and non-technical content.

Now, generate a well-structured Markdown article based on the topic: **{INSERT TOPIC HERE}**
`;

// Localhost IP
const LOCALHOST_IP = "https://workable-lemur-primary.ngrok-free.app";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Create a streaming response
    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            // Check if Ollama is running
            const ollamaCheck = await fetch(`${LOCALHOST_IP}/api/version`)
              .then((res) => res.ok)
              .catch(() => false);

            if (!ollamaCheck) {
              controller.error(new Error("Ollama server is not running"));
              return;
            }

            // Prepare articles content
            const articleFiles = await fs.readdir(ARTICLES_DIR);
            const articles = await Promise.all(
              articleFiles
                .filter((file) => file.endsWith(".txt") || file.endsWith(".md"))
                .map(async (file) => {
                  const filePath = path.join(ARTICLES_DIR, file);
                  const content = await fs.readFile(filePath, "utf-8");
                  return {
                    title: file.replace(/\.(txt|md)$/, ""),
                    content,
                  };
                })
            );
            const articlesContent = articles
              .map(
                (article) =>
                  `Title: ${article.title}\n\nContent:\n${article.content}\n\n`
              )
              .join("---\n");

            // Create the fetch request to Ollama for streaming
            const response = await fetch(`${LOCALHOST_IP}/api/generate`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: AI_MODEL,
                prompt: `You are an expert content writer. Based on the following reference articles, write a new comprehensive article about "${prompt}".
                 ${MARKDOWN_INSTRUCTIONS}
                 Use the writing style, tone, and structure from these articles, and use snippets from the articles as much as you can.
                 Incorporate relevant insights and patterns from the source articles while maintaining originality.
                 Do not use the your own knowledge or research. Only answer based on the provided articles.
                 Also please only respond in English.
                 
                 Reference Articles:
                 ${articlesContent}
                 
                 Write a well-structured, engaging article about "${prompt}":`,
                stream: true,
                stop: ["<think></think>"],
              }),
            });

            // Handle the streaming response
            if (!response.body) {
              controller.error(new Error("No response body"));
              return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                controller.close();
                break;
              }

              const chunk = decoder.decode(value);
              try {
                const parsedChunk = JSON.parse(chunk);
                if (parsedChunk.response) {
                  controller.enqueue(encoder.encode(parsedChunk.response));
                }
              } catch (parseError) {
                // If parsing fails, it might be a partial JSON or non-JSON response
                console.warn("Error parsing chunk:", parseError);
              }
            }
          } catch (error) {
            console.error("Streaming error:", error);
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      }
    );
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: `Failed to generate article: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
