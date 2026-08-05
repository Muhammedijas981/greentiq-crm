import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
      {icon && <div className="text-slate-500 mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/50">{icon}</div>}
      <h3 className="text-lg font-medium text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
