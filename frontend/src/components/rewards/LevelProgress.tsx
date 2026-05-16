import React from 'react';
import {useTranslations} from 'next-intl';

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export function LevelProgress({ level, xp, xpToNextLevel }: LevelProgressProps) {
  const t = useTranslations('Rewards');
  const currentLevelXP = xp % 100;
  const progress = currentLevelXP;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('level')}</span>
          <div className="text-3xl font-bold dark:text-white">{level}</div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{xp} XP</span>
          <div className="text-xs text-gray-400">{t('xpToLevel', { xp: xpToNextLevel, level: level + 1 })}</div>
        </div>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
