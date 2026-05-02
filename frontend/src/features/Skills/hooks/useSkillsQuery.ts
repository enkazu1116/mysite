import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../api/fetchSkills";

export const useSkillsQuery = () => {
    const { data: skillsData, isLoading, error, refetch } = useQuery({
        queryKey: ['skills'],
        queryFn: fetchSkills,
    });

    return { skills: skillsData, isLoading, error, refetch };
};
