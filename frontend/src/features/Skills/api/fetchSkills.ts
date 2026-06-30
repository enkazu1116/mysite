import { client } from "../../../lib/api-client";

export const fetchSkills = async () => {
  const response = await client.skills.$get();

  if (!response.ok) {
    throw new Error(`Failed to fetch skills: ${response.status}`);
  }

  return response.json();
};
