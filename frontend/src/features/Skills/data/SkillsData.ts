import type { Skill } from '../types/skill';

export const skills: Skill[] = [
    {
        userId: 'user-1',
        skillId: 'skill-1',
        language: 'Java',
        techs: [{ techId: 'tech-1', name: 'Spring Boot', category: 'framework' }],
        experienceMonths: 36,
        level: 3,
        detail: 'Web application development',
    },
    {
        userId: 'user-1',
        skillId: 'skill-2',
        language: 'Go',
        techs: [],
        experienceMonths: 24,
        level: 3,
        detail: 'Backend services',
    },
    {
        userId: 'user-1',
        skillId: 'skill-3',
        language: 'JavaScript',
        techs: [{ techId: 'tech-2', name: 'Node.js', category: 'runtime' }],
        experienceMonths: 18,
        level: 2,
        detail: 'Scripting and tooling',
    },
];
