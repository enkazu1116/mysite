import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchSkills } from "../api/fetchSkills";

export const useSkillsSuspenseQuery = () => {
    const { data: skillsData, isLoading, error, refetch } = useSuspenseQuery({
        queryKey: ['skills'],
        queryFn: fetchSkills,
    });

    return { skills: skillsData, isLoading, error, refetch };
};