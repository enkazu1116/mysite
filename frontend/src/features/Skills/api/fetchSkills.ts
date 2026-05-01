import type { Skill } from "../types/skill";

// APIからデータを取得するロジックを定義
export const fetchSkills = async (): Promise<Skill[]> => {
  const response = await fetch("/api/skills");
  if (!response.ok) {
    throw new Error(`Failed to fetch skills: ${response.status}`);
  }
  
  return response.json();
};