// src/utils/env.ts
/**
 * Reads public runtime variables in both Next.js and local tooling.
 */
export function getEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env && key in process.env) {
    return process.env[key];
  }

  console.warn(`Missing environment variable: ${key}`);
  return undefined;
}
