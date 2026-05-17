"use client";

import React, { useState, useEffect } from 'react';
import {
  DashboardOverview,
  WealthProgressionChart,
  AssetAllocationChart,
  IncomeVsExpenseChart,
} from '@/components/dashboard/Overview';
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
  { name: 'Actions', value: 45 },
  { name: 'Cash', value: 15 },
  { name: 'Crypto', value: 10 },
  { name: 'Immobilier', value: 25 },
  { name: 'Or', value: 5 },
];

const mockIncomeVsExpense = [
  { name: 'Jan', income: 5000, expense: 3000 },
  { name: 'Feb', income: 5200, expense: 3100 },
  { name: 'Mar', income: 4800, expense: 3500 },
  { name: 'Apr', income: 6000, expense: 3200 },
  { name: 'May', income: 5500, expense: 3300 },
  { name: 'Jun', income: 7000, expense: 3400 },
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
        // Fallback for demo if API fails
        setProgress({
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          badges: []
        });
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <IncomeVsExpenseChart data={mockIncomeVsExpense} />
          <WealthProgressionChart data={mockProgression} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AssetAllocationChart data={mockAllocation} />
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-6 dark:text-white">Les 7 Règles de Babylone</h3>
            <div className="space-y-4">
              {[
                "Commencez à remplir votre bourse (Épargnez 10%)",
                "Contrôlez vos dépenses",
                "Faites fructifier votre or",
                "Protégez votre trésor contre la perte",
                "Faites de votre demeure un investissement profitable",
                "Assurez un revenu pour le futur",
                "Augmentez votre capacité à gagner"
              ].map((rule, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm">
                    {i+1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
