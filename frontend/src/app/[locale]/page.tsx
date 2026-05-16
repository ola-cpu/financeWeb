"use client";

import React, { useState, useEffect } from 'react';
import { DashboardOverview, WealthProgressionChart, AssetAllocationChart } from '@/components/dashboard/Overview';
import { Sidebar } from '@/components/layout/Sidebar';
import { LevelProgress } from '@/components/rewards/LevelProgress';
import { useTranslations } from 'next-intl';
import { gamificationApi } from '@/lib/api';

const mockProgression = [
  { name: 'Jan', value: 10000 },
  { name: 'Feb', value: 12500 },
  { name: 'Mar', value: 15000 },
  { name: 'Apr', value: 14000 },
  { name: 'May', value: 18000 },
  { name: 'Jun', value: 22000 },
];

const mockAllocation = [
  { name: 'Stocks', value: 45 },
  { name: 'Cash', value: 15 },
  { name: 'Crypto', value: 10 },
  { name: 'Real Estate', value: 25 },
  { name: 'Gold', value: 5 },
];

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const [progress, setProgress] = useState<any>(null);
  const [data, setData] = useState({
    netWorth: 54200,
    monthlyChange: '+12.5%',
    healthScore: 85,
  });

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await gamificationApi.getProgress();
        setProgress(response.data);
      } catch (error) {
        console.error('Failed to fetch gamification progress', error);
      }
    }
    fetchProgress();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('welcome', {name: 'Arkad'})}</p>
        </header>

        {progress && (
          <LevelProgress
            level={progress.level}
            xp={progress.xp}
            xpToNextLevel={progress.xpToNextLevel}
          />
        )}

        <DashboardOverview data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WealthProgressionChart data={mockProgression} />
          <AssetAllocationChart data={mockAllocation} />
        </div>
      </main>
    </div>
  );
}
