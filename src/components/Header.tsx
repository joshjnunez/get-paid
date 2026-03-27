import { useState } from 'react';

interface HeaderProps {
  monthLabel: string;
  onMonthLabelChange: (label: string) => void;
}

export function Header({ monthLabel, onMonthLabelChange }: HeaderProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(monthLabel);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onMonthLabelChange(trimmed);
    } else {
      setDraft(monthLabel);
    }
    setEditing(false);
  };

  return (
    <header className="pt-6 pb-4 px-5 text-center">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
        Get Paid
      </h1>
      {editing ? (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="mt-1 text-center text-sm text-gray-500 bg-transparent border-b border-brand-400 outline-none px-2 py-1"
          autoFocus
        />
      ) : (
        <button
          onClick={() => { setDraft(monthLabel); setEditing(true); }}
          className="mt-1 text-sm text-gray-500 hover:text-brand-600 transition-colors cursor-pointer"
        >
          {monthLabel} &middot; <span className="text-brand-500 text-xs">edit</span>
        </button>
      )}
    </header>
  );
}
