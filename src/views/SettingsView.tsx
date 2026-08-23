import React from 'react';
import { PreferencesForm } from '../components/settings/PreferencesForm';
import { DataManagement } from '../components/settings/DataManagement';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize exam goals, target percentiles, themes, 3D visual effects, and manage local data backups
        </p>
      </div>

      {/* 1. Aspirant Preferences Form */}
      <PreferencesForm />

      {/* 2. Backup, Import & Data Portability */}
      <DataManagement />
    </div>
  );
};
