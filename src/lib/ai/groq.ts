import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_build_key",
});

// In-memory cache with TTL to prevent hammering rate limits on concurrent page visits
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached<T>(key: string, data: T, ttlSeconds: number = 300) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Robust JSON extractor that handles:
 * - Markdown fences (```json ... ```)
 * - Leading/trailing conversational commentary
 * - Bracket and brace extraction
 */
export function extractJson<T>(raw: string, fallback: T): T {
  if (!raw || typeof raw !== "string") return fallback;

  // 1. Direct parse
  try {
    return JSON.parse(raw);
  } catch {}

  // 2. Strip standard markdown code blocks
  const stripped = raw
    .replace(/^```(?:json)?\s*/gim, "")
    .replace(/\s*```$/gm, "")
    .trim();

  try {
    return JSON.parse(stripped);
  } catch {}

  // 3. Find outermost array [ ... ]
  const firstBracket = stripped.indexOf("[");
  const lastBracket = stripped.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(stripped.slice(firstBracket, lastBracket + 1));
    } catch {}
  }

  // 4. Find outermost object { ... }
  const firstBrace = stripped.indexOf("{");
  const lastBrace = stripped.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
    } catch {}
  }

  return fallback;
}

export interface QueryGroqJsonOptions<T> {
  prompt: string;
  systemPrompt?: string;
  cacheKey?: string;
  ttlSeconds?: number;
  fallback: T;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Executes a resilient AI completion with:
 * 1. Fast in-memory cache lookup
 * 2. Primary model (e.g. qwen/qwen3.8-27b - fast, token-efficient, no reasoning overhead)
 * 3. Automatic failover to secondary model (openai/gpt-oss-120b) on rate limit or error
 * 4. Automatic fallback dataset if all API calls fail so the UI is NEVER blank or broken
 */
export async function queryGroqJson<T>({
  prompt,
  systemPrompt = "You are an elite travel AI engine. You output only valid JSON without markdown formatting.",
  cacheKey,
  ttlSeconds = 300,
  fallback,
  maxTokens = 2000,
  temperature = 0.7,
}: QueryGroqJsonOptions<T>): Promise<T> {
  // Check cache
  if (cacheKey) {
    const cached = getCached<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy_build_key") {
    return fallback;
  }

  const primaryModel = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
  const fallbackModel = process.env.GROQ_FALLBACK_MODEL || "openai/gpt-oss-120b";
  const modelsToTry = [primaryModel];
  if (fallbackModel !== primaryModel) {
    modelsToTry.push(fallbackModel);
  }

  for (const model of modelsToTry) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        model: model,
        temperature: temperature,
        max_tokens: maxTokens,
      });

      const content = completion.choices[0]?.message?.content || "";
      const parsed = extractJson<T>(content, null as unknown as T);

      if (parsed !== null && parsed !== undefined) {
        // Validate if expected an array and got an array, or expected object
        if (Array.isArray(fallback) && !Array.isArray(parsed)) {
          // If wrapped in an object like { destinations: [...] } or { results: [...] }
          const innerArray = Object.values(parsed).find(Array.isArray);
          if (innerArray) {
            if (cacheKey) setCached(cacheKey, innerArray, ttlSeconds);
            return innerArray as unknown as T;
          }
        } else {
          if (cacheKey) setCached(cacheKey, parsed, ttlSeconds);
          return parsed;
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`Groq request failed with model ${model}:`, errMsg);
      // Continue to next model in loop
    }
  }

  console.warn("All Groq models exhausted. Serving context-aware fallback data.");
  if (cacheKey && fallback) {
    setCached(cacheKey, fallback, 60); // cache fallback for 1 minute to avoid hammering
  }
  return fallback;
}
