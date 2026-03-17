import { DocumentWithRelations } from './types';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  async getDocuments(): Promise<DocumentWithRelations[]> {
    const res = await fetch('/api/documents');
    return handleResponse(res);
  },

  async getDocument(id: string): Promise<DocumentWithRelations> {
    const res = await fetch(`/api/documents/${id}`);
    return handleResponse(res);
  },

  async createDocument(title: string, owner?: string): Promise<DocumentWithRelations> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, owner }),
    });
    return handleResponse(res);
  },

  async updateDocument(id: string, data: { title?: string; content?: string }): Promise<DocumentWithRelations> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteDocument(id: string): Promise<void> {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  async shareDocument(documentId: string, email: string): Promise<void> {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, email }),
    });
    return handleResponse(res);
  },

  async uploadFile(documentId: string, file: File): Promise<{ id: string; name: string; path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentId', documentId);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    return handleResponse(res);
  },
};
