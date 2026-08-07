import React from 'react';

type Status = 'Active' | 'Inactive' | 'Prospect' | 'Archive' | 'Lead';

interface StatusBadgeProps {
  status: Status | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = 'bg-muted';
  let textColor = 'text-muted-foreground';

  const s = status.toLowerCase();
  if (s.includes('active') && !s.includes('inactive')) {
    bgColor = 'bg-emerald-500/20';
    textColor = 'text-emerald-500';
  } else if (s.includes('inactive') || s.includes('archive')) {
    bgColor = 'bg-orange-500/20';
    textColor = 'text-orange-500';
  } else if (s.includes('prospect') || s.includes('lead')) {
    bgColor = 'bg-blue-500/20';
    textColor = 'text-blue-500';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
}
