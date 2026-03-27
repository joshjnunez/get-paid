import { useState } from 'react';
import { Card, CardTitle } from './Card';
import {
  calculateScenarioProjection,
  getCurrentTierStatus,
  formatCurrency,
  CONSTANTS,
} from '../utils/commission';

interface MotivationCardProps {
  points: number;
  topTierMultiplier: number;
}

const SCENARIOS = [0.5, 1, 3, 5, 10];

export function MotivationCard({ points, topTierMultiplier }: MotivationCardProps) {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const status = getCurrentTierStatus(points);

  const projection = selectedScenario !== null
    ? calculateScenarioProjection(points, selectedScenario, topTierMultiplier)
    : null;

  const getMotivationalText = (): string => {
    if (points === 0) return "Start booking meetings — every point counts!";
    if (status.tier === 'below' && status.pointsToNextTier <= 5) {
      return `Only ${status.pointsToNextTier.toFixed(1)} points from quota — you're almost there!`;
    }
    if (status.tier === 'below') {
      return `${status.pointsToNextTier.toFixed(1)} points to go. Keep pushing!`;
    }
    if (status.tier === 'quota') return "You hit quota! Now chase those accelerators.";
    if (status.tier === 'tier1') return `Earning at 1.5×! ${status.pointsToNextTier.toFixed(1)} pts to Tier 2.`;
    if (status.tier === 'tier2') return `Earning at 2×! ${status.pointsToNextTier.toFixed(1)} pts to Tier 3.`;
    return "You're in max accelerator mode. Every point is gold.";
  };

  return (
    <Card>
      <CardTitle>What If...</CardTitle>
      <p className="text-sm text-gray-500 mb-3">{getMotivationalText()}</p>

      {/* Scenario chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SCENARIOS.map((val) => (
          <button
            key={val}
            onClick={() => setSelectedScenario(selectedScenario === val ? null : val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none ${
              selectedScenario === val
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            +{val} pt{val !== 1 ? 's' : ''}
          </button>
        ))}
      </div>

      {/* Projection result */}
      {projection && (
        <div className="bg-brand-50 rounded-xl p-4 space-y-2 number-transition">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Projected points</span>
            <span className="font-bold text-gray-800">{projection.projectedPoints.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Projected commission</span>
            <span className="font-bold text-brand-600 tabular-nums">{formatCurrency(projection.projectedCommission)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Projected gross</span>
            <span className="font-bold text-emerald-600 tabular-nums">{formatCurrency(projection.projectedGross)}</span>
          </div>
          <div className="border-t border-brand-100 pt-2 mt-1">
            <div className="flex justify-between text-sm">
              <span className="text-brand-600 font-semibold">Extra earnings</span>
              <span className="font-extrabold text-brand-700 tabular-nums">+{formatCurrency(projection.increaseGross)}</span>
            </div>
          </div>
          {/* Contextual motivational note */}
          {selectedScenario && points < CONSTANTS.MONTHLY_QUOTA_POINTS && points + selectedScenario >= CONSTANTS.MONTHLY_QUOTA_POINTS && (
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {points + selectedScenario > CONSTANTS.MONTHLY_QUOTA_POINTS
                ? "This puts you into accelerator range!"
                : "This puts you at quota!"}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
