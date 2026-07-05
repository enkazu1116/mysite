import { http, HttpResponse } from 'msw';
import { projects } from '../../../Projects/data/ProjectData';

export const handlers = [
    http.get('/api/skills', () => {
        return HttpResponse.json([
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
                language: 'TypeScript',
                techs: [{ techId: 'tech-2', name: 'React', category: 'framework' }],
                experienceMonths: 24,
                level: 2,
                detail: 'Frontend development',
            },
        ]);
    }),
    http.get('/api/projects', () => {
        return HttpResponse.json(projects);
    }),
];
