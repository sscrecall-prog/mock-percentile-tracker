import React from 'react';
import { ShieldCheck, Activity, Gauge, TrendingUp, Zap } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { calculateScoreVariance } from '../../engine/analyticsEngine';
import { Card3DTilt } from '../3d/Card3DTilt';

export const ConsistencyMatrix: React.FC = () => {
  const { mocks } = useMocks();
  const matrix = calculateScoreVariance(mocks);

  return (
    <Card3DTilt
      maxTilt={2}
      className="p-6 rounded-3xl border border-white/5 light:border-slate-200 bg-darkSurface light:bg-white shadow-3d-dark space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mint-dark dark:text-mint">
          <Activity className="w-4 h-4" />
          <span>Performance Stability & Consistency</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
          Variance & Standard Deviation Across Attempts
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Measures how reliably you reproduce your peak scores across consecutive tests
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Stability Index</div>
          <div className="text-2xl font-black text-mint-dark dark:text-mint">
            {matrix.stabilityIndex} <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-400">Higher = Rock solid consistency</p>
        </div>

        <div className="p-4 rounded-2xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Score Std Dev (σ)</div>
          <div className="text-2xl font-black text-electric-blue">
            ±{matrix.scoreStdDev}
          </div>
          <p className="text-[10px] text-slate-400">Average score fluctuation margin</p>
        </div>

        <div className="p-4 rounded-2xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Score Variance (σ²)</div>
          <div className="text-2xl font-black text-white light:text-slate-900">
            {matrix.scoreVariance}
          </div>
          <p className="text-[10px] text-slate-400">Statistical dispersion</p>
        </div>

        <div className="p-4 rounded-2xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">%ile Std Dev</div>
          <div className="text-2xl font-black text-lavender">
            ±{matrix.percentileStdDev}%
          </div>
          <p className="text-[10px] text-slate-400">Rank band stability</p>
        </div>
      </div>
    </Card3DTilt>
  );
};
