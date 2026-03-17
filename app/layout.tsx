import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'LaveDocs',
  description: 'Collaborative document editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
