import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Box, 
  Zap, 
  Target, 
  Save, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { ExamType } from '../../types/mock';
import { ThemeMode } from '../../types/settings';
import { Card3DTilt } from '../3d/Card3DTilt';

export const PreferencesForm: React.FC = () => {
  const { settings, updateSettings } = useMocks();
  const { theme, setTheme, enable3D, setEnable3D, reducedMotion, setReducedMotion } = useTheme();

  const [selectedExam, setSelectedExam] = useState<ExamType>(settings.selectedExam);
  const [targetPercentile, setTargetPercentile] = useState<number>(settings.targetPercentile);
  const [targetScore, setTargetScore] = useState<number>(settings.targetScore);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      selectedExam,
      targetPercentile,
      targetScore,
      theme,
      enable3D,
      reducedMotion
    });
  };

  return (
    <Card3DTilt
      maxTilt={1}
      className="p-6 rounded-3xl border border-white/5 light:border-slate-200 bg-darkSurface light:bg-white shadow-3d-dark space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-electric-blue">
          <Sliders className="w-4 h-4" />
          <span>Aspirant Configuration</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
          Exam Objectives & Display Preferences
        </h3>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Exam Goal & Targets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Primary Exam Goal
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value as ExamType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs sm:text-sm font-semibold"
            >
              <option value="SSC CGL">SSC CGL (Tier 1 & Tier 2)</option>
              <option value="SSC CHSL">SSC CHSL</option>
              <option value="SSC MTS">SSC MTS</option>
              <option value="RRB NTPC">RRB NTPC</option>
              <option value="IBPS PO">IBPS PO</option>
              <option value="SBI PO">SBI PO</option>
              <option value="Custom">Custom Competitive Exam</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Percentile (%)
            </label>
            <input
              type="number"
              step="0.5"
              min="50"
              max="100"
              value={targetPercentile}
              onChange={(e) => setTargetPercentile(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs sm:text-sm font-bold text-electric-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Score (Marks)
            </label>
            <input
              type="number"
              step="1"
              min="50"
              max="300"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs sm:text-sm font-bold text-mint-dark dark:text-mint"
            />
          </div>
        </div>

        {/* Theme Mode Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Application Theme System
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'dark', label: 'Dark Obsidian', icon: <Moon className="w-4 h-4 text-electric-blue" />, desc: 'AI Command Center' },
              { id: 'light', label: 'Day White', icon: <Sun className="w-4 h-4 text-amber-500" />, desc: 'High Contrast Clean' },
              { id: 'warm-cream', label: 'Warm Cream', icon: <span className="text-sm">📜</span>, desc: 'Editorial Paper' },
              { id: 'system', label: 'System Auto', icon: <Sliders className="w-4 h-4 text-lavender" />, desc: 'Follow OS preference' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id as ThemeMode)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  theme === t.id
                    ? 'border-electric-blue bg-electric-blue/10 shadow-glow-blue'
                    : 'border-white/5 light:border-slate-200 bg-darkContainer/40 light:bg-slate-50 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {t.icon}
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{t.label}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3D & Motion Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5 light:border-slate-100">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-darkContainer/40 light:bg-slate-50 border border-white/5">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-electric-blue" />
                <span>3D Visuals & Tilt Effects</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Enable Three.js particle constellation and card hover tilts
              </p>
            </div>
            <input
              type="checkbox"
              checked={enable3D}
              onChange={(e) => setEnable3D(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 text-electric-blue focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-darkContainer/40 light:bg-slate-50 border border-white/5">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amberAccent" />
                <span>Reduced Motion</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Disable floating transforms and heavy animations
              </p>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 text-amberAccent focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-electric-dark text-darkBg font-extrabold text-xs shadow-glow-blue hover:opacity-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </Card3DTilt>
  );
};
