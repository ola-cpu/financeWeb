"use client";
import { AUTH_USER_ID } from "@/lib/auth";

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
import { gamificationApi, usersApi } from '@/lib/api';
import { useNotification } from '@/components/layout/NotificationProvider';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { notify } = useNotification();
  const [progress, setProgress] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = AUTH_USER_ID;
        const [progressRes, summaryRes] = await Promise.all([
          gamificationApi.getProgress(),
          usersApi.getDashboardSummary(userId)
        ]);
        setProgress(progressRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        notify('Erreur lors de la récupération des données du tableau de bord', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('welcome', {name: 'Arkad'})}</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {progress && (
              <LevelProgress
                level={progress.level}
                xp={progress.xp}
                xpToNextLevel={progress.xpToNextLevel}
              />
            )}

            {summary && (
              <>
                <DashboardOverview data={{
                  netWorth: summary.netWorth,
                  monthlyChange: summary.monthlyChange,
                  healthScore: summary.healthScore,
                  totalSavings: summary.totalSavings,
                  budgetRemaining: summary.budgetRemaining,
                  passiveIncome: summary.passiveIncome,
                  savingsRate: summary.savingsRate,
                }} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <IncomeVsExpenseChart data={summary.charts.incomeVsExpense} />
                  <WealthProgressionChart data={summary.charts.wealthProgression} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <AssetAllocationChart data={summary.charts.assetAllocation} />
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-6 dark:text-white">Les 7 Règles de Babylone</h3>
                    <div className="space-y-4">
                      {summary.rulesStatus?.map((rule: any, i: number) => (
                        <div key={rule.id} className="flex gap-4 items-start">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                            rule.completed
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            {rule.completed ? '✓' : i + 1}
                          </div>
                          <p className={`text-sm font-medium ${rule.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {rule.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
