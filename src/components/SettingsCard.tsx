import { Card, CardTitle } from './Card';

interface SettingsCardProps {
  topTierMultiplier: number;
  onMultiplierChange: (multiplier: number) => void;
}

const MULTIPLIER_OPTIONS = [2, 2.5, 3, 4, 5];

export function SettingsCard({ topTierMultiplier, onMultiplierChange }: SettingsCardProps) {
  return (
    <Card>
      <CardTitle>Settings</CardTitle>
      <div>
        <p className="text-sm text-gray-500 mb-3">Tier 3 accelerator multiplier</p>
        <div className="flex flex-wrap gap-2">
          {MULTIPLIER_OPTIONS.map((val) => (
            <button
              key={val}
              onClick={() => onMultiplierChange(val)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none ${
                topTierMultiplier === val
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {val}×
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
