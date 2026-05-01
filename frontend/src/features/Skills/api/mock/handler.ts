import { http, HttpResponse } from 'msw';

export const handlers = [
    http.get('/api/skills', () => {
        return HttpResponse.json([
            { id: 1, skill: 'Java', level: 3 },
            { id: 2, skill: 'Go', level: 3 },
            { id: 3, skill: 'JavaScript', level: 2 },
            { id: 4, skill: 'TypeScript', level: 2 },
            { id: 5, skill: 'React', level: 2 },
            { id: 6, skill: 'Node.js', level: 2 },
        ]);
    }),
];