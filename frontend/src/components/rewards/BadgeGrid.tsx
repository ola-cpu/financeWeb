import React from 'react';
import * as LucideIcons from 'lucide-react';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  code: string;
}

interface BadgeGridProps {
  badges: Badge[];
  allBadges?: Badge[];
}

export function BadgeGrid({ badges, allBadges }: BadgeGridProps) {
  const earnedBadgeCodes = new Set(badges.map(b => b.code));

  const displayBadges = allBadges || badges;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayBadges.map((badge) => {
        const isEarned = earnedBadgeCodes.has(badge.code);
        // @ts-ignore
        const Icon = LucideIcons[badge.icon] || LucideIcons.Award;

        return (
          <div
            key={badge.code}
            className={`p-6 rounded-2xl border transition-all ${
              isEarned
                ? 'bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900/30 shadow-sm'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-60 grayscale'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isEarned ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}>
              <Icon size={24} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{badge.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
