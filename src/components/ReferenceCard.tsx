import { Card, CardTitle } from './Card';

const POINT_VALUES = [
  { role: 'VP / C-Suite', points: 5, color: 'bg-violet-100 text-violet-700' },
  { role: 'Director', points: 3, color: 'bg-brand-100 text-brand-700' },
  { role: 'Manager', points: 1, color: 'bg-emerald-100 text-emerald-700' },
  { role: 'IC', points: 0.5, color: 'bg-gray-100 text-gray-600' },
];

export function ReferenceCard() {
  return (
    <Card>
      <CardTitle>Point Reference</CardTitle>
      <div className="grid grid-cols-2 gap-2">
        {POINT_VALUES.map(({ role, points, color }) => (
          <div key={role} className={`rounded-xl px-3 py-2.5 ${color}`}>
            <p className="text-xs font-medium opacity-70">{role}</p>
            <p className="text-lg font-bold">{points} pts</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
