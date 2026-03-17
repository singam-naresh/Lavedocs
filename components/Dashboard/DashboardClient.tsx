'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Clock, Users, Trash2, Loader2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { DocumentWithRelations, DEFAULT_USER } from '@/lib/types';
import { getCurrentUser, setCurrentUser } from '@/lib/user';

function SkeletonCard() {
  return (
    <div className="bg-white border rounded-xl p-5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg" />
        <div className="w-5 h-5 bg-slate-100 rounded" />
      </div>
      <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  );
}

export default function DashboardClient() {
  const [docs, setDocs] = useState<DocumentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'shared'>('my');
  const [currentUser, setUser] = useState<string>(() => {
    if (typeof window !== 'undefined') return getCurrentUser();
    return DEFAULT_USER;
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments();
      setDocs(data);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  // Re-fetch when window regains focus (returning from editor after adding collaborator)
  useEffect(() => {
    const onFocus = () => loadDocs();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadDocs]);

  // Build the switcher list dynamically from every email in the loaded docs.
  // This means any newly added collaborator automatically appears here.
  const allUsers: string[] = Array.from(
    new Set([
      DEFAULT_USER,
      ...docs.map(d => d.owner),
      ...docs.flatMap(d => d.collaborators.map(c => c.email)),
    ])
  ).sort((a, b) => {
    // Keep DEFAULT_USER first, then alphabetical
    if (a === DEFAULT_USER) return -1;
    if (b === DEFAULT_USER) return 1;
    return a.localeCompare(b);
  });

  const handleCreate = async () => {
    setCreating(true);
    try {
      const newDoc = await api.createDocument('Untitled Document', currentUser);
      router.push(`/editor/${newDoc.id}`);
    } catch {
      toast.error('Failed to create document');
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this document?')) return;
    try {
      await api.deleteDocument(id);
      toast.success('Document deleted');
      setDocs(prev => prev.filter(d => d.id !== id));
    } catch {
      toast.error('Failed to delete document');
    }
  };

  const handleSwitchUser = async (user: string) => {
    setCurrentUser(user);
    setUser(user);
    setUserMenuOpen(false);
    toast.success(`Switched to ${user}`);
    setLoading(true);
    try {
      const data = await api.getDocuments();
      setDocs(data);
      const newCu = user.toLowerCase().trim();
      const hasOwned = data.some(d => d.owner.toLowerCase().trim() === newCu);
      const hasShared = data.some(
        d => d.owner.toLowerCase().trim() !== newCu &&
             d.collaborators.some(c => c.email.toLowerCase().trim() === newCu)
      );
      setActiveTab(hasOwned ? 'my' : hasShared ? 'shared' : 'my');
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const cu = currentUser.toLowerCase().trim();
  const myDocs = docs.filter(d => d.owner.toLowerCase().trim() === cu);
  const sharedDocs = docs.filter(d =>
    d.owner.toLowerCase().trim() !== cu &&
    d.collaborators.some(c => c.email.toLowerCase().trim() === cu)
  );
  const displayedDocs = activeTab === 'my' ? myDocs : sharedDocs;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <FileText className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">LaveDocs</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-slate-900 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100"
              >
                <span className="hidden sm:inline max-w-[180px] truncate">{currentUser}</span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white border rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                  <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Switch User
                  </p>
                  {allUsers.map(user => (
                    <button
                      key={user}
                      onClick={() => handleSwitchUser(user)}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between gap-2 ${
                        user === currentUser ? 'text-primary font-medium' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{user}</span>
                      {user === currentUser && (
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full shrink-0">
                          active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            >
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              <span className="hidden sm:inline">New Document</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* Click-outside overlay — z-10 so it sits BELOW the dropdown (z-30) */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-6 sm:gap-8 border-b mb-8">
          {(['my', 'shared'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {tab === 'my' ? 'My Documents' : 'Shared With Me'}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayedDocs.length === 0 ? (
          <EmptyState tab={activeTab} onCreate={handleCreate} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedDocs.map(doc => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                isOwner={doc.owner.toLowerCase().trim() === cu}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ tab, onCreate }: { tab: 'my' | 'shared'; onCreate: () => void }) {
  return (
    <div className="text-center py-20 sm:py-28 bg-white border rounded-2xl shadow-sm">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="text-slate-400" size={32} />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {tab === 'my' ? 'No documents yet' : 'No shared documents yet'}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
        {tab === 'my'
          ? 'Create your first document to get started.'
          : 'Documents shared with you will appear here.'}
      </p>
      {tab === 'my' && (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
        >
          <Plus size={16} />
          Create your first document
        </button>
      )}
    </div>
  );
}

function DocumentCard({
  doc,
  isOwner,
  onDelete,
}: {
  doc: DocumentWithRelations;
  isOwner: boolean;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  return (
    <Link
      href={`/editor/${doc.id}`}
      className="group relative bg-white border rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
          <FileText className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={22} />
        </div>
        {isOwner && (
          <button
            onClick={e => onDelete(e, doc.id)}
            aria-label="Delete document"
            className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <h3 className="font-semibold text-slate-900 mb-2 truncate leading-snug">
        {doc.title || 'Untitled Document'}
      </h3>

      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock size={11} />
          <span>Updated {formatDistanceToNow(new Date(doc.updatedAt))} ago</span>
        </div>
        {doc.collaborators.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Users size={11} />
            <span>
              {doc.collaborators.length} collaborator{doc.collaborators.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {!isOwner && (
          <div className="flex items-center gap-1.5 text-indigo-500">
            <Users size={11} />
            <span>Shared by {doc.owner}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
