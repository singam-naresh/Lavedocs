export const DEFAULT_USER = 'lave@owner.com';

// Legacy alias kept so API routes compile
export const CURRENT_USER = DEFAULT_USER;

export interface Collaborator {
  id: string;
  email: string;
  documentId: string;
}

export interface DocumentWithRelations {
  id: string;
  title: string;
  content: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  collaborators: Collaborator[];
  files: { id: string; name: string; path: string }[];
}
