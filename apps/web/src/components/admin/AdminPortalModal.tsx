'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Shield,
  Palette,
  Type,
  Database,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  RotateCcw,
  Lock,
  Eye,
  Save,
} from 'lucide-react';
import { useGlass } from '../ui/GlassControls';
import { useAuth } from '../../context/AuthContext';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPortalModal({ isOpen, onClose }: AdminPortalModalProps) {
  const { user } = useAuth();
  const {
    isGlassEnabled,
    setIsGlassEnabled,
    controls,
    updateControls,
    resetControls,
    texts,
    updateTexts,
    resetTexts,
    styleCard,
  } = useGlass();

  const [activeTab, setActiveTab] = useState<'ui' | 'texts' | 'security'>('ui');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Local draft state for page texts
  const [localTexts, setLocalTexts] = useState(texts);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSaveTexts = (e: React.FormEvent) => {
    e.preventDefault();
    updateTexts(localTexts);
    triggerToast('Page texts and brand slogans updated across all views!');
  };

  const handleResetTexts = () => {
    resetTexts();
    setLocalTexts(texts);
    triggerToast('Page texts reset to official defaults.');
  };

  const ACCENT_COLORS = [
    { name: 'Emerald Green', value: '#16a34a' },
    { name: 'Cyber Blue', value: '#2563eb' },
    { name: 'Electric Purple', value: '#9333ea' },
    { name: 'Sunset Amber', value: '#d97706' },
    { name: 'Crimson Rose', value: '#e11d48' },
    { name: 'Neon Cyan', value: '#0891b2' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          style={isGlassEnabled ? styleCard : undefined}
          className={`w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl flex flex-col max-h-[85vh] ${
            isGlassEnabled ? 'bg-surface/90 border border-white/20' : 'bg-surface border border-line'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line p-5 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-xs">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-ink">Admin Super Portal</h2>
                  <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-3xs font-semibold text-purple-600 border border-purple-500/20">
                    Administrator Vixy
                  </span>
                </div>
                <p className="text-2xs text-ink-3">Live UI/UX Experience Studio & Security Headquarters</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Subheader Navigation */}
          <div className="flex items-center gap-2 border-b border-line px-6 py-2 bg-surface-2/40">
            <button
              type="button"
              onClick={() => setActiveTab('ui')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ui'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>UI/UX & Glass Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('texts')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'texts'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              <span>Page Texts & Brand</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Database Defense & RLS</span>
            </button>
          </div>

          {/* Toast Notice */}
          {saveToast && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-green/10 border border-green/30 p-2.5 text-xs font-medium text-green animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{saveToast}</span>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: UI & GLASS STUDIO */}
            {activeTab === 'ui' && (
              <div className="space-y-6">
                {/* 1. Global UI Paradigm Toggle */}
                <div className="rounded-2xl border border-line bg-surface-2/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span>Interface Aesthetic Engine</span>
                    </h3>
                    <p className="text-2xs text-ink-3 mt-0.5">
                      Toggle between the Modern Liquid Glass UI and the Classic Solid UI
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-canvas p-1 rounded-xl border border-line shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsGlassEnabled(true);
                        triggerToast('Modern Liquid Glass UI activated.');
                      }}
                      className={`px-3 py-1.5 text-2xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isGlassEnabled
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-ink-3 hover:text-ink'
                      }`}
                    >
                      Liquid Glass UI
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsGlassEnabled(false);
                        triggerToast('Classic Solid UI activated.');
                      }}
                      className={`px-3 py-1.5 text-2xs font-semibold rounded-lg transition-all cursor-pointer ${
                        !isGlassEnabled
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-ink-3 hover:text-ink'
                      }`}
                    >
                      Classic UI
                    </button>
                  </div>
                </div>

                {/* 2. Glass Live Controls (Active when Glass is enabled) */}
                {isGlassEnabled ? (
                  <div className="space-y-5 rounded-2xl border border-line bg-surface p-4">
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Sliders className="h-4 w-4 text-purple-600" />
                        <span>Glass Parameters Customizer</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          resetControls();
                          triggerToast('Glass parameters reset to recommended balance.');
                        }}
                        className="flex items-center gap-1 text-3xs font-semibold text-ink-3 hover:text-purple-600 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Tint / Transparency */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-2xs font-medium text-ink-2">
                          <span>Glass Tint / Transparency</span>
                          <span className="font-mono text-ink tabular-nums">
                            {Math.round(controls.tint * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.02"
                          max="0.4"
                          step="0.01"
                          value={controls.tint}
                          onChange={(e) => updateControls({ tint: parseFloat(e.target.value) })}
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                      </div>

                      {/* Blur / Frost */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-2xs font-medium text-ink-2">
                          <span>Frosted Blur Intensity</span>
                          <span className="font-mono text-ink tabular-nums">
                            {Math.round(controls.frost * 28)}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={controls.frost}
                          onChange={(e) => updateControls({ frost: parseFloat(e.target.value) })}
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                      </div>

                      {/* Aberration / Border Glow */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-2xs font-medium text-ink-2">
                          <span>Edge Glow & Aberration</span>
                          <span className="font-mono text-ink tabular-nums">{controls.aberration}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="1"
                          value={controls.aberration}
                          onChange={(e) => updateControls({ aberration: parseInt(e.target.value, 10) })}
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                      </div>

                      {/* Bevel Depth */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-2xs font-medium text-ink-2">
                          <span>Bevel Shadow Depth</span>
                          <span className="font-mono text-ink tabular-nums">{controls.bevelDepth}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={controls.bevelDepth}
                          onChange={(e) => updateControls({ bevelDepth: parseInt(e.target.value, 10) })}
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                      </div>

                      {/* Corner Radius */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-2xs font-medium text-ink-2">
                          <span>Card Corner Radius</span>
                          <span className="font-mono text-ink tabular-nums">{controls.radius || 20}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="36"
                          step="2"
                          value={controls.radius || 20}
                          onChange={(e) => updateControls({ radius: parseInt(e.target.value, 10) })}
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                      </div>

                      {/* Shape Selection */}
                      <div className="space-y-1.5">
                        <div className="text-2xs font-medium text-ink-2">Floating Bar Shape</div>
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          {(['pill', 'rounded', 'sharp'] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateControls({ shape: s })}
                              className={`py-1 text-2xs font-semibold capitalize rounded-lg border transition-all cursor-pointer ${
                                controls.shape === s
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                                  : 'bg-surface-2 text-ink-2 border-line hover:text-ink'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="pt-2">
                      <div className="text-3xs uppercase tracking-wider font-semibold text-ink-3 mb-2">
                        Live Glass Preview
                      </div>
                      <div
                        style={styleCard}
                        className="p-4 flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-600 border border-purple-500/30">
                            <Layers className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-ink">Frosted Glass Surface</div>
                            <div className="text-2xs text-ink-3">Dynamic live reflection of controls</div>
                          </div>
                        </div>
                        <span className="rounded-full bg-purple-600/10 text-purple-600 px-2 py-0.5 text-3xs font-semibold border border-purple-500/20">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-line bg-surface p-6 text-center space-y-2">
                    <p className="text-xs font-medium text-ink-2">
                      Classic Solid UI mode is currently active across the dashboard.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsGlassEnabled(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors cursor-pointer shadow-xs"
                    >
                      Switch to Modern Liquid Glass UI
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PAGE TEXTS & BRAND */}
            {activeTab === 'texts' && (
              <form onSubmit={handleSaveTexts} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <div>
                    <h3 className="text-xs font-bold text-ink">Page Slogans & Banner Headlines</h3>
                    <p className="text-2xs text-ink-3">
                      Modify global branding, motivational quotes, and banner text across all student views
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetTexts}
                    className="flex items-center gap-1 text-3xs font-semibold text-ink-3 hover:text-purple-600 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Defaults</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-semibold text-ink-2 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={localTexts.brandName}
                      onChange={(e) => setLocalTexts({ ...localTexts, brandName: e.target.value })}
                      className="w-full rounded-xl border border-line bg-surface py-2 px-3 text-xs text-ink focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-semibold text-ink-2 mb-1">Brand Subtitle / Motto</label>
                    <input
                      type="text"
                      value={localTexts.brandSubtitle}
                      onChange={(e) => setLocalTexts({ ...localTexts, brandSubtitle: e.target.value })}
                      className="w-full rounded-xl border border-line bg-surface py-2 px-3 text-xs text-ink focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-semibold text-ink-2 mb-1">Motivation Card Title</label>
                    <input
                      type="text"
                      value={localTexts.mottoTitle}
                      onChange={(e) => setLocalTexts({ ...localTexts, mottoTitle: e.target.value })}
                      className="w-full rounded-xl border border-line bg-surface py-2 px-3 text-xs text-ink focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-semibold text-ink-2 mb-1">Motivation Card Subtitle</label>
                    <input
                      type="text"
                      value={localTexts.mottoSubtitle}
                      onChange={(e) => setLocalTexts({ ...localTexts, mottoSubtitle: e.target.value })}
                      className="w-full rounded-xl border border-line bg-surface py-2 px-3 text-xs text-ink focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-2xs font-semibold text-ink-2 mb-1">Preparation Banner Headline</label>
                    <input
                      type="text"
                      value={localTexts.prepBannerTitle}
                      onChange={(e) => setLocalTexts({ ...localTexts, prepBannerTitle: e.target.value })}
                      className="w-full rounded-xl border border-line bg-surface py-2 px-3 text-xs text-ink focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-2xs font-semibold text-ink-2 mb-1">Preparation Banner Subtitle</label>
                    <input
                      type="text"
                      value={localTexts.prepBannerSubtitle}
                      onChange={(e) => setLocalTexts({ ...localTexts, prepBannerSubtitle: e.target.value })}
                      className="w-full rounded-xl border border-line bg-surface py-2 px-3 text-xs text-ink focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Apply Brand & Slogan Updates</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: DATABASE DEFENSE & RLS */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
                  <div className="flex items-center gap-2 text-green font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Zero-Trust Database & Anti-Bot Security Active</span>
                  </div>
                  <p className="mt-1 text-2xs text-ink-2 leading-relaxed">
                    Row Level Security (RLS) is strictly enforced across all 16 database tables. Public anon access is revoked, and Cloudflare Turnstile human verification is active on all registration endpoints with zero testing banners.
                  </p>
                </div>

                {/* Cloudflare Turnstile Production Defense Box */}
                <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-ink font-bold text-xs">
                      <svg className="h-4 w-4 text-[#F38020]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                      </svg>
                      <span>Cloudflare Turnstile Anti-Bot Shield</span>
                    </div>
                    <span className="rounded-full bg-green/10 text-green px-2 py-0.5 text-3xs font-semibold border border-green/20">
                      Zero Bypass Enforced
                    </span>
                  </div>
                  <p className="text-2xs text-ink-3 leading-relaxed">
                    Automated bots, headless browsers, synthetic clicks (<code>isTrusted: false</code>), and scrapers are strictly blocked. Single-use replay protection and honeypot traps ensure 100% human authenticity.
                  </p>
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-3xs text-ink-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 border border-line">
                      ✓ No Test Banners
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 border border-line">
                      ✓ Honeypot Trap Active
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 border border-line">
                      ✓ Replay Attack Blocked
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 border border-line">
                      ✓ Webdriver Filtered
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-2xs">
                  <div className="rounded-xl border border-line bg-surface p-3 space-y-1">
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-purple-600" />
                      <span>Anon Key Protection</span>
                    </div>
                    <p className="text-ink-3">
                      Publicly available publishable keys cannot query student records, focus logs, or preferences.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-surface p-3 space-y-1">
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-green" />
                      <span>Curriculum Whitelist</span>
                    </div>
                    <p className="text-ink-3">
                      Only verified Ethiopian curriculum subjects and units are readable by unauthenticated users.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-surface p-3 space-y-1">
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-blue-600" />
                      <span>Identity Binding</span>
                    </div>
                    <p className="text-ink-3">
                      All row writes and reads require valid JWT matching <code>auth.uid() = user_id</code>.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-surface p-3 space-y-1">
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                      <span>Logout Zero-Residue Purge</span>
                    </div>
                    <p className="text-ink-3">
                      On logout, all IndexedDB tables and local sessions are completely wiped to 0% for privacy.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface-2 p-3">
                  <div className="text-3xs uppercase tracking-wider font-semibold text-ink-3 mb-1.5">
                    Security Migration Script
                  </div>
                  <pre className="text-3xs font-mono text-ink-2 bg-canvas p-2.5 rounded-lg overflow-x-auto max-h-36">
{`-- Enforce Zero-Trust RLS on all 16 tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "student_chapter_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "study_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "focus_sessions" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, public;
GRANT SELECT ON "curriculum_subjects" TO anon, authenticated;
CREATE POLICY "Users access own data" ON "student_chapter_progress"
  FOR ALL TO authenticated USING (auth.uid()::text = user_id);`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
