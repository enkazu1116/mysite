type Project = {
  projectId: string;
  userId: string;
  projectName: string;
  overview: string;
  myRole: string;
  teamSize: number;
  technologies: string;
  challenges: string;
  decisions: string;
  outcomes: string;
  createdAt: string;
  updatedAt: string;
};

type CreateProjectPayload = {
  userId: string;
  projectName: string;
  overview: string;
  myRole: string;
  teamSize: number;
  technologies: string;
  challenges: string;
  decisions: string;
  outcomes: string;
};

type UpdateProjectPayload = {
  projectName?: string;
  overview?: string;
  myRole?: string;
  teamSize?: number;
  technologies?: string;
  challenges?: string;
  decisions?: string;
  outcomes?: string;
};

export type { CreateProjectPayload, Project, UpdateProjectPayload };
