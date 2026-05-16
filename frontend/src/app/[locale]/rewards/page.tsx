"use client";

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { LevelProgress } from '@/components/rewards/LevelProgress';
import { BadgeGrid } from '@/components/rewards/BadgeGrid';
import { useTranslations } from 'next-intl';
import { gamificationApi } from '@/lib/api';

export default function RewardsPage() {
  const t = useTranslations('Rewards');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);

  const allBadges = [
    { id: 1, name: 'First Steps', description: 'Added your first transaction', icon: 'Footprints', code: 'FIRST_STEPS' },
    { id: 2, name: 'Disciplined Saver', description: 'Maintained a 10% savings rate', icon: 'PiggyBank', code: 'SAVER_10' },
    { id: 3, name: 'Master Saver', description: 'Maintained a 20% savings rate', icon: 'Wallet', code: 'SAVER_20' },
    { id: 4, name: 'The First Law', description: 'Followed the rule: "A part of all you earn is yours to keep"', icon: 'Coins', code: 'GOLDEN_RULE' },
  ];

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await gamificationApi.getProgress();
        setProgress(response.data);
      } catch (error) {
        console.error('Failed to fetch gamification progress', error);
        // Fallback for demo if API fails
        setProgress({
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          badges: []
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-xl font-medium dark:text-white">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
        </header>

        {progress && (
          <>
            <LevelProgress
              level={progress.level}
              xp={progress.xp}
              xpToNextLevel={progress.xpToNextLevel}
            />

            <div className="mb-8">
              <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-4">{t('yourBadges')}</h2>
              <BadgeGrid badges={progress.badges} allBadges={allBadges} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
