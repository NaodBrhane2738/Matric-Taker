import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green/10 text-green mb-4">
          <BookOpen className="h-6 w-6" />
        </div>

        <span className="text-xs font-semibold tracking-wider text-green uppercase">
          404 Error
        </span>
        <h1 className="mt-2 text-xl font-bold text-ink">Curriculum Page Not Found</h1>
        <p className="mt-2 text-xs text-ink-3 leading-relaxed">
          The requested study resource or curriculum path does not exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-green px-4 py-2 text-xs font-medium text-white hover:bg-green-dark transition-colors shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Study Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
