import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { PreferencesProvider } from '../context/PreferencesContext';
import { CurriculumProvider } from '../context/CurriculumContext';
import { GlassProvider } from '../components/ui/GlassControls';

export const metadata: Metadata = {
  title: 'Matric Tracker — Ethiopian Grade 12 National Exam Preparation',
  description: 'Comprehensive secondary curriculum coverage, knowledge mastery, and study management platform.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen antialiased bg-canvas text-ink">
        <AuthProvider>
          <PreferencesProvider>
            <CurriculumProvider>
              <GlassProvider>
                {children}
              </GlassProvider>
            </CurriculumProvider>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
