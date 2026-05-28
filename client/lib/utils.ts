import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const providerFromModel = (m = "") => {
  if (m.startsWith("groq:")) return "groq";
  if (m.startsWith("gemini")) return "gemini";
  return "openai";
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString();
};
