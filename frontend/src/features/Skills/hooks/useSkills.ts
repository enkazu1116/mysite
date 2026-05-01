import { useCallback, useEffect, useState } from "react";
import { fetchSkills as fetchSkillsApi } from "../api/fetchSkills";
import type { Skill } from "../types/skill";

// APIから取得するスキルデータを管理する。
export const useSkills = () => {
    // 状態変数
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // fetchSkills関数を定義し、APIからデータを取得する。
    const fetchSkills = useCallback(async () => {
        setLoading(true);
        setError(null);
    
        try {
            const data = await fetchSkillsApi();
            setSkills(data);
        } catch (error: unknown) {
            setError(error instanceof Error ? error : new Error("Unknown error"));
        } finally {
            setLoading(false);
        }
    }, []);

    // fetchSkills関数を実行
    useEffect(() => {
        void fetchSkills();
    }, [fetchSkills]);

    return { skills, loading, error, fetchSkills };
};
