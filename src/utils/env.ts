// src/utils/env.ts
/**
 * Works in both Node (process.env) and Vite (import.meta.env)
 */
export function getEnv(key: string): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env && key in import.meta.env) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && key in process.env) {
    return process.env[key];
  }
  console.warn(`⚠️ Missing environment variable: ${key}`);
  return undefined;
}
