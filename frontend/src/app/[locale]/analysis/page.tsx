"use client";
import { AUTH_USER_ID } from "@/lib/auth";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations } from 'next-intl';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { aiApi, assetsApi, transactionsApi } from '@/lib/api';

export default function AnalysisPage() {
  const t = useTranslations('Analysis');
  const [habitAdvice, setHabitAdvice] = useState<string>('');
  const [optimalAllocation, setOptimalAllocation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = AUTH_USER_ID;
        const [transRes, allocRes] = await Promise.all([
          transactionsApi.getAll(userId),
          assetsApi.getOptimalAllocation(userId)
        ]);

        const habitsResponse = await aiApi.analyzeHabits(transRes.data);
        setHabitAdvice(habitsResponse.data);
        setOptimalAllocation(allocRes.data);
      } catch (error) {
        console.error('Failed to fetch analysis data', error);
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
        </header>

        {loading ? (
            <div className="text-center p-12 dark:text-white">Analyzing your gold flow...</div>
        ) : (
            <>
                <section className="mb-12">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">{t('spendingHabits')}</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex gap-4 items-start">
                            {habitAdvice.includes('detected') || habitAdvice.includes('away') ? (
                                <AlertTriangle className="text-red-500 shrink-0" />
                            ) : (
                                <CheckCircle className="text-green-500 shrink-0" />
                            )}
                            <p className="text-gray-700 dark:text-gray-300 italic">{habitAdvice}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4 dark:text-white">{t('optimalAllocation')}</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="space-y-4">
                            {optimalAllocation.map((item) => (
                                <div key={item.type}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium dark:text-white">{item.type}</span>
                                        <span className="text-sm font-medium dark:text-white">{item.value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </>
        )}
      </main>
    </div>
  );
}
