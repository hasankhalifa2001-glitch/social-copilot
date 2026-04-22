import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses post content which might be a JSON string or a plain string.
 * If JSON, it extracts the 'base' key or returns the first available platform key.
 */
export function parsePostContent(content: string): string {
  if (!content) return "";

  try {
    // Check if it's a JSON string
    if (content.startsWith('{') && content.endsWith('}')) {
      const parsed = JSON.parse(content);

      // If it's the structure we expect: { base: "...", twitter: "...", etc }
      if (parsed.base) return parsed.base;

      // Fallback to the first key that has a string value if 'base' is missing
      const firstKey = Object.keys(parsed).find(key => typeof parsed[key] === 'string');
      if (firstKey) return parsed[firstKey];
    }
  } catch (e) {
    // Fallback to original content if parsing fails
  }

  return content;
}
