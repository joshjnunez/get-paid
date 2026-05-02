import { Card, CardTitle } from './Card';
import { getCurrentTierStatus, formatPercent, CONSTANTS } from '../utils/commission';

interface ProgressTierProps {
  points: number;
}

const TIER_COLORS = {
  below: { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-200 text-gray-700' },
  quota: { bg: 'bg-brand-100', text: 'text-brand-700', badge: 'bg-brand-500 text-white' },
  over: { bg: 'bg-emerald-100', text: 'text-emerald-700', badge: 'bg-emerald-500 text-white' },
};

export function ProgressTier({ points }: ProgressTierProps) {
  const status = getCurrentTierStatus(points);
  const colors = TIER_COLORS[status.tier];

  const maxDisplay = 60;
  const quotaPct = (CONSTANTS.MONTHLY_QUOTA_POINTS / maxDisplay) * 100;
  const overQuotaPct = 100 - quotaPct;
  const fillPct = Math.min((points / maxDisplay) * 100, 100);

  return (
    <Card>
      <CardTitle>Progress & Tier</CardTitle>

      {/* Tier badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${colors.badge} ${status.tier !== 'below' ? 'tier-badge-shimmer' : ''}`}>
          {status.label}
        </span>
        <span className={`text-sm font-bold ${colors.text}`}>
          {formatPercent(status.attainmentPercent)}
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="relative mb-3">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
          <div className="bg-brand-200 border-r border-white/50" style={{ width: `${quotaPct}%` }} />
          <div className="bg-emerald-200" style={{ width: `${overQuotaPct}%` }} />
        </div>
        {/* Fill overlay */}
        <div className="absolute top-0 left-0 h-4 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${fillPct}%`,
            background: points <= 30
              ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
              : 'linear-gradient(90deg, #3b82f6, #10b981)',
          }}
        />
        {/* Quota marker */}
        <div className="absolute top-0 h-4 w-0.5 bg-white/70" style={{ left: `${quotaPct}%` }} />
      </div>

      {/* Labels under bar */}
      <div className="flex text-[10px] text-gray-400 font-medium mb-4">
        <div style={{ width: `${quotaPct}%` }} className="text-center">0–30</div>
        <div style={{ width: `${overQuotaPct}%` }} className="text-center">30+</div>
      </div>

      {/* Status text */}
      <div className="space-y-1 text-sm">
        {status.tier === 'below' && (
          <>
            <p className="text-gray-600">
              <span className="font-bold">{status.pointsToNextTier.toFixed(1)}</span> points to quota
            </p>
            <p className="text-gray-400">Keep booking — you've got this!</p>
          </>
        )}
        {status.tier === 'quota' && (
          <>
            <p className="text-brand-600 font-semibold">You hit quota!</p>
            <p className="text-gray-400">Every additional point earns $100</p>
          </>
        )}
        {status.tier === 'over' && (
          <>
            <p className={`${colors.text} font-semibold`}>
              Over quota! Earning $100 per additional point.
            </p>
            <p className="text-gray-500">
              <span className="font-bold">{(points - CONSTANTS.MONTHLY_QUOTA_POINTS).toFixed(1)}</span> pts over quota
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
