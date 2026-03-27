import { Card, CardTitle } from './Card';
import {
  calculateTierBreakdown,
  calculateGrossPay,
  formatCurrency,
  CONSTANTS,
} from '../utils/commission';

interface CommissionBreakdownProps {
  points: number;
  topTierMultiplier: number;
}

export function CommissionBreakdown({ points, topTierMultiplier }: CommissionBreakdownProps) {
  const breakdown = calculateTierBreakdown(points, topTierMultiplier);
  const grossPay = calculateGrossPay(points, topTierMultiplier);

  const rows = [
    { label: 'Base pay', value: CONSTANTS.MONTHLY_BASE_GROSS, always: true },
    { label: `Base commission (${Math.min(points, 30)} pts)`, value: breakdown.baseCommission, always: true },
    { label: `Tier 1 — 1.5× (${breakdown.tier1Points.toFixed(1)} pts)`, value: breakdown.tier1Value, always: false },
    { label: `Tier 2 — 2× (${breakdown.tier2Points.toFixed(1)} pts)`, value: breakdown.tier2Value, always: false },
    { label: `Tier 3 — ${topTierMultiplier}× (${breakdown.tier3Points.toFixed(1)} pts)`, value: breakdown.tier3Value, always: false },
  ];

  return (
    <Card>
      <CardTitle>Commission Breakdown</CardTitle>
      <div className="space-y-2">
        {rows.map((row) =>
          (row.always || row.value > 0) ? (
            <div key={row.label} className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-semibold text-gray-800 tabular-nums">{formatCurrency(row.value)}</span>
            </div>
          ) : null
        )}
        <div className="border-t border-gray-100 pt-2 mt-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Total commission</span>
            <span className="font-bold text-brand-600 tabular-nums">{formatCurrency(breakdown.totalCommission)}</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-brand-50 rounded-xl p-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Estimated Monthly Gross</span>
            <span className="text-xl font-extrabold text-emerald-700 tabular-nums">{formatCurrency(grossPay)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
