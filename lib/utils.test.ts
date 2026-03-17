import { DocumentWithRelations } from './types';

export function filterByOwner(docs: DocumentWithRelations[], email: string) {
  return docs.filter(d => d.owner === email);
}

export function filterShared(docs: DocumentWithRelations[], email: string) {
  return docs.filter(d => d.collaborators.some(c => c.email === email));
}

// Tests
describe('filterByOwner', () => {
  const docs = [
    { id: '1', owner: 'me@example.com', collaborators: [] },
    { id: '2', owner: 'other@example.com', collaborators: [] },
  ] as DocumentWithRelations[];

  it('returns only docs owned by the given email', () => {
    const result = filterByOwner(docs, 'me@example.com');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns empty array when no match', () => {
    expect(filterByOwner(docs, 'nobody@example.com')).toHaveLength(0);
  });
});

describe('filterShared', () => {
  const docs = [
    { id: '1', owner: 'other@example.com', collaborators: [{ id: 'c1', email: 'me@example.com' }] },
    { id: '2', owner: 'other@example.com', collaborators: [] },
  ] as DocumentWithRelations[];

  it('returns docs where user is a collaborator', () => {
    const result = filterShared(docs, 'me@example.com');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
