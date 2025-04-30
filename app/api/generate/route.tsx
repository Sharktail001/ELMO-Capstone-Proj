import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const AI_MODEL = "deepseek-r1:14b";
const LOCALHOST_IP = "https://workable-lemur-primary.ngrok-free.app";
const EXTERNAL_API_URL =
  "https://e5e6ofaqlj.execute-api.us-east-1.amazonaws.com/prod";
const API_KEY = "YsPr9O9Sww4g92Hmge3Va7ZxcVac04f05jn6tJ5q";

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

async function fetchCuratedArticles(
  prompt: string,
  user_id = "123456",
  curatedId = "12345678"
): Promise<string> {
  try {
    const response = await fetch(`${EXTERNAL_API_URL}`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: prompt,
        user_id: user_id,
        curated_id: curatedId,
      }),
    });

    if (!response.ok) {
      throw new Error(`External API responded with ${response.status}`);
    }

    const data = await response.json();

    const articles = data?.body?.articles ?? [];

    const fullTextContent = articles
      .map((article: any) => article.full_text || "")
      .join("\n\n");

    console.log("Fetched articles:", articles);
    console.log("Full text content:", fullTextContent);
    return fullTextContent;
  } catch (error) {
    console.error("Failed to fetch from external API:", error);
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            const ollamaCheck = await fetch(`${LOCALHOST_IP}/api/version`)
              .then((res) => res.ok)
              .catch(() => false);

            if (!ollamaCheck) {
              controller.error(new Error("Ollama server is not running"));
              return;
            }

            const curatedArticle = await fetchCuratedArticles(prompt);

            const ollamaPrompt = `You are an expert content writer. Based on the following reference articles, write a comprehensive and cohesive article on the topic: "${prompt}".

${MARKDOWN_INSTRUCTIONS}

Strictly follow these additional rules:
- The article **must** start with a large title using a single '#' (Markdown h1).
- **No other heading** in the article should use '#'. Use only '##' or '###' for section headings.
- Ensure the main title is the **largest and most prominent** heading.
- Integrate as much information as possible from the reference articles. **Do not omit important details**.
- Present the content in a logically flowing and unified article, not a summary or bullet dump.
- Maintain proper Markdown formatting and structure.
- Do not add your own research or knowledge — use only the reference content provided.
- Write fluently and clearly in English only.
- You must only respond in English, regardless of the content or language found in the reference articles.
- Do not include any non-English words, phrases, or translations in the output.
- If non-English content appears in the reference articles, summarize or paraphrase it in English only.
- Do **not fabricate** facts, examples, or content not found in the reference articles.
- Do **not hallucinate** or guess information to meet a size requirement.
- You may expand or elaborate only on what is present in the articles, using paraphrasing or synthesis.
- Aim to write a **complete and informative article**, not a short summary, but always stay grounded in the reference material.
- If there is limited content, structure and explain it fully rather than adding unrelated filler.

Reference Articles:
${curatedArticle}

Write the full Markdown article for: "${prompt}"
`;

            const response = await fetch(`${LOCALHOST_IP}/api/generate`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: AI_MODEL,
                prompt: ollamaPrompt,
                stream: false,
                stop: ["<think></think>"],
              }),
            });

            if (!response.ok) {
              controller.error(
                new Error(`Ollama responded with ${response.status}`)
              );
              return;
            }

            const responseData = await response.json();
            if (responseData && responseData.response) {
              controller.enqueue(encoder.encode(responseData.response));
              controller.close(); // ✅ This line fixes the hanging issue
            } else {
              controller.error(
                new Error("No response content received from Ollama")
              );
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
