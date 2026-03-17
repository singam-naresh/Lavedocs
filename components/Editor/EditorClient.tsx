'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import { api } from '@/lib/api';
import { DocumentWithRelations } from '@/lib/types';
import { getCurrentUser } from '@/lib/user';
import Tiptap from './Tiptap';
import Sidebar from './Sidebar';

interface Props { id: string }
type SaveStatus = 'saved' | 'saving' | 'error';

export default function EditorClient({ id }: Props) {
  const router = useRouter();
  const [doc, setDoc] = useState<DocumentWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') return getCurrentUser();
    return '';
  });
  const docIdRef = useRef(id);

  const loadDoc = useCallback(async () => {
    try {
      const data = await api.getDocument(id);
      setDoc(data);
    } catch {
      toast.error('Failed to load document');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { loadDoc(); }, [loadDoc]);

  const save = useCallback(async (updates: { title?: string; content?: string }) => {
    setSaveStatus('saving');
    try {
      const updated = await api.updateDocument(docIdRef.current, updates);
      setDoc(updated);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
      toast.error('Failed to save document');
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSaveContent = useCallback(
    debounce((content: string) => save({ content }), 1500),
    [save],
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-muted-foreground">Loading document…</p>
      </div>
    );
  }

  if (!doc) return null;

  const isOwner = currentUser === doc.owner;

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <header className="h-14 sm:h-16 bg-white border-b px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          >
            <ChevronLeft size={20} />
          </Link>
          <input
            type="text"
            value={doc.title}
            onChange={e => {
              if (!isOwner) return;
              const title = e.target.value;
              setDoc(prev => prev ? { ...prev, title } : prev);
              save({ title });
            }}
            readOnly={!isOwner}
            className={`text-base sm:text-lg font-semibold bg-transparent border-none focus:ring-0 p-0 w-full min-w-0 truncate ${
              !isOwner ? 'cursor-default select-none text-slate-500' : ''
            }`}
            placeholder="Untitled Document"
            aria-label="Document title"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isOwner && (
            <span className="hidden sm:inline text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">
              Collaborator
            </span>
          )}
          <SaveIndicator status={saveStatus} />
          <button
            onClick={() => save({ content: doc.content, title: doc.title })}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={15} />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <Tiptap
              content={doc.content}
              onChange={content => {
                setDoc(prev => prev ? { ...prev, content } : prev);
                debouncedSaveContent(content);
              }}
            />
          </div>
        </main>

        <Sidebar doc={doc} isOwner={isOwner} onUpdate={loadDoc} />
      </div>
    </div>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'saving') {
    return (
      <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 size={12} className="animate-spin" />
        Saving…
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="hidden sm:flex items-center gap-1.5 text-xs text-red-500">
        Save failed
      </span>
    );
  }
  return (
    <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
      <CheckCircle2 size={12} className="text-green-500" />
      All changes saved
    </span>
  );
}
