'use client';

import { useState } from 'react';
import { Users, FileText, Plus, Upload, Loader2, Crown } from 'lucide-react';
import { DocumentWithRelations } from '@/lib/types';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface SidebarProps {
  doc: DocumentWithRelations;
  isOwner: boolean;
  onUpdate: () => void;
}

export default function Sidebar({ doc, isOwner, onUpdate }: SidebarProps) {
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Enter a valid email address');
      return;
    }

    if (trimmed === doc.owner) {
      toast.error('That email is already the document owner');
      return;
    }

    if (doc.collaborators.some(c => c.email === trimmed)) {
      toast.error(`${trimmed} is already a collaborator`);
      return;
    }

    setIsSharing(true);
    try {
      await api.shareDocument(doc.id, trimmed);
      toast.success(`Shared with ${trimmed}`);
      setEmail('');
      onUpdate(); // re-fetch doc so collaborator list updates immediately
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to share document';
      toast.error(msg);
    } finally {
      setIsSharing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      toast.error('Only .txt files are supported');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(p => Math.min(p + 20, 80));
    }, 150);

    try {
      await api.uploadFile(doc.id, file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.success(`"${file.name}" uploaded`);
      onUpdate();
    } catch {
      clearInterval(progressInterval);
      toast.error('File upload failed');
    } finally {
      setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 600);
      e.target.value = '';
    }
  };

  return (
    <aside className="hidden lg:flex w-72 xl:w-80 flex-col gap-6 p-5 border-l bg-white h-full overflow-y-auto shrink-0">

      {/* ── Collaborators ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm">
          <Users size={16} />
          <span>Collaborators</span>
        </div>

        {/* Add collaborator — owner only */}
        {isOwner && (
          <form onSubmit={handleShare} className="flex gap-2 mb-3">
            <input
              type="email"
              placeholder="Add by email…"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
            />
            <button
              type="submit"
              disabled={isSharing || !email.trim()}
              aria-label="Add collaborator"
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
            >
              {isSharing ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            </button>
          </form>
        )}

        {/* People list */}
        <div className="space-y-1.5">
          {/* Owner */}
          <PersonRow email={doc.owner} role="Owner" isOwner />
          {/* Collaborators */}
          {doc.collaborators.length === 0 && !isOwner && (
            <p className="text-xs text-muted-foreground px-1 py-2">No other collaborators.</p>
          )}
          {doc.collaborators.map(c => (
            <PersonRow key={c.id} email={c.email} role="Collaborator" isOwner={false} />
          ))}
        </div>
      </section>

      {/* ── Attachments ───────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3 text-slate-800 font-semibold text-sm">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span>Attachments</span>
          </div>
          <label
            className="cursor-pointer p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            title="Upload .txt file"
          >
            <Upload size={15} />
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".txt"
              disabled={isUploading}
            />
          </label>
        </div>

        {isUploading && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Uploading…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {doc.files.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed rounded-xl text-muted-foreground">
            <Upload size={20} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">No files attached</p>
            <p className="text-xs opacity-60 mt-0.5">Upload a .txt file</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {doc.files.map(file => (
              <a
                key={file.id}
                href={file.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 text-sm bg-slate-50 border rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors group"
              >
                <FileText size={14} className="text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />
                <span className="truncate font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                  {file.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}

// ── Person row ────────────────────────────────────────────────────────────────

function PersonRow({ email, role, isOwner }: { email: string; role: string; isOwner: boolean }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      toast.success(`Copied ${email}`);
    }).catch(() => {
      toast.error('Could not copy email');
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy email"
      className="w-full flex items-center gap-2.5 p-2 bg-slate-50 border rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-left"
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          isOwner ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {email[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-slate-800">{email}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {isOwner && <Crown size={10} className="text-indigo-500" />}
          <span>{role}</span>
        </div>
      </div>
    </button>
  );
}
