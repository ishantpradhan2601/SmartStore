import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  delayIndex = 0,
}) {
  const colorMap = {
    primary: {
      border: 'border-primary-500/10 hover:border-primary-500/30',
      iconBg: 'bg-primary-500/10 text-primary-400',
      shadow: 'hover:shadow-[0_8px_30px_-5px_rgba(124,58,237,0.12)]',
    },
    accent: {
      border: 'border-accent-500/10 hover:border-accent-500/30',
      iconBg: 'bg-accent-500/10 text-accent-400',
      shadow: 'hover:shadow-[0_8px_30px_-5px_rgba(6,182,212,0.12)]',
    },
    success: {
      border: 'border-success-500/10 hover:border-success-500/30',
      iconBg: 'bg-success-500/10 text-success-400',
      shadow: 'hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.12)]',
    },
    danger: {
      border: 'border-danger-500/10 hover:border-danger-500/30',
      iconBg: 'bg-danger-500/10 text-danger-400',
      shadow: 'hover:shadow-[0_8px_30px_-5px_rgba(239,68,68,0.12)]',
    },
    warning: {
      border: 'border-warning-500/10 hover:border-warning-500/30',
      iconBg: 'bg-warning-500/10 text-warning-400',
      shadow: 'hover:shadow-[0_8px_30px_-5px_rgba(245,158,11,0.12)]',
    },
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`glass-card p-6 flex items-center justify-between border ${scheme.border} ${scheme.shadow} animate-fadeInUp`}
      style={{ animationDelay: `${delayIndex * 100}ms` }}
    >
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-dark-300">
          {title}
        </span>
        <h3 className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </h3>
        
        {trendValue !== undefined && (
          <div className="flex items-center gap-1.5 mt-1">
            {trend === 'up' ? (
              <span className="flex items-center gap-0.5 text-xs font-bold text-success-400 bg-success-500/10 px-2 py-0.5 rounded-full border border-success-500/15">
                <FiTrendingUp className="text-sm" /> +{trendValue}%
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-xs font-bold text-danger-400 bg-danger-500/10 px-2 py-0.5 rounded-full border border-danger-500/15">
                <FiTrendingDown className="text-sm" /> {trendValue}%
              </span>
            )}
            <span className="text-[10px] text-dark-300 font-medium">vs last month</span>
          </div>
        )}
      </div>

      <div className={`p-4 rounded-2xl ${scheme.iconBg} transition-transform duration-300 hover:scale-110`}>
        {Icon && <Icon className="text-2xl" />}
      </div>
    </div>
  );
}
