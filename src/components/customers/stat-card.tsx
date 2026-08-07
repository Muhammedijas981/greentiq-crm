import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({ 
  title, 
  value, 
  trend, 
  trendUp,
  icon,
  iconBg,
  iconColor
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col flex-1 shadow-sm">
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-10 h-10 rounded flex items-center justify-center ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <span className="text-3xl font-semibold text-foreground">{value}</span>
      </div>
      <div className="text-muted-foreground text-sm mb-2">{title}</div>
      {trend && trendUp !== undefined && (
        <div className="text-muted-foreground text-xs flex items-center gap-1">
          Trend <span className={trendUp ? 'text-emerald-500' : 'text-red-500'}>{trend} {trendUp ? '↑ Green' : '↓ Red'}</span>
        </div>
      )}
    </div>
  );
}
