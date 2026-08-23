import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Info, Trophy } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { Card3DTilt } from '../3d/Card3DTilt';
import { Badge } from '../common/Badge';

export const PerformanceInsightsList: React.FC = () => {
  const { insights } = useMocks();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lavender">
            <Sparkles className="w-4 h-4" />
            <span>Real Data Discoveries</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            Performance Intelligence Feed
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const isPositive = insight.type === 'POSITIVE';
          const isWarning = insight.type === 'WARNING';

          return (
            <Card3DTilt
              key={insight.id}
              maxTilt={3}
              className={`p-5 rounded-2xl border transition-all shadow-3d-dark space-y-3 ${
                isPositive
                  ? 'bg-gradient-to-br from-mint/10 via-darkSurface to-darkContainer light:from-emerald-50 light:via-white light:to-white border-mint/20'
                  : isWarning
                    ? 'bg-gradient-to-br from-alert-red/10 via-darkSurface to-darkContainer light:from-rose-50 light:via-white light:to-white border-alert-red/20'
                    : 'bg-darkSurface light:bg-white border-white/5 light:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPositive && <CheckCircle2 className="w-4 h-4 text-mint-dark dark:text-mint shrink-0" />}
                  {isWarning && <AlertTriangle className="w-4 h-4 text-alert-red shrink-0" />}
                  {!isPositive && !isWarning && <Info className="w-4 h-4 text-electric-blue shrink-0" />}
                  
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {insight.title}
                  </h4>
                </div>

                {insight.value && (
                  <Badge variant={isPositive ? 'success' : isWarning ? 'alert' : 'primary'} size="sm">
                    {insight.value}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed">
                {insight.message}
              </p>
            </Card3DTilt>
          );
        })}
      </div>
    </div>
  );
};
