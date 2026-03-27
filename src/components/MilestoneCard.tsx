import { Card, CardTitle } from './Card';
import { calculateCommission, calculateGrossPay, formatCurrency } from '../utils/commission';

interface MilestoneCardProps {
  points: number;
  topTierMultiplier: number;
}

const MILESTONES = [30, 37.5, 45, 50, 60];

export function MilestoneCard({ points, topTierMultiplier }: MilestoneCardProps) {
  return (
    <Card>
      <CardTitle>Milestones</CardTitle>
      <div className="space-y-2">
        {MILESTONES.map((target) => {
          const commission = calculateCommission(target, topTierMultiplier);
          const gross = calculateGrossPay(target, topTierMultiplier);
          const remaining = Math.max(target - points, 0);
          const hit = points >= target;

          return (
            <div
              key={target}
              className={`flex items-center justify-between rounded-xl p-3 text-sm transition-all ${
                hit ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  hit ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {hit ? '✓' : target}
                </span>
                <div className="text-left">
                  <p className={`font-semibold ${hit ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {target} pts
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatCurrency(commission)} comm · {formatCurrency(gross)} gross
                  </p>
                </div>
              </div>
              <div className="text-right">
                {hit ? (
                  <span className="text-xs font-semibold text-emerald-600">Hit!</span>
                ) : (
                  <span className="text-xs font-semibold text-gray-500">{remaining.toFixed(1)} to go</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
