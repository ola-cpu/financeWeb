"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Target, TrendingUp, Landmark, ShieldCheck } from 'lucide-react';
import { axiosInstance } from '@/lib/api';

export default function SavingsPage() {
  const t = useTranslations('Savings');
  const locale = useLocale();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const userId = 1;
        const response = await axiosInstance.get(`/savings?userId=${userId}`);
        setGoals(response.data);
      } catch (error) {
        console.error('Failed to fetch savings goals', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGoals();
  }, []);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
            <Plus size={20} />
            {t('newGoal')}
          </button>
        </header>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 text-white mb-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={24} />
              <span className="font-medium">{t('babylonRule')}</span>
            </div>
            <h2 className="text-4xl font-bold mb-2">{t('saveTen')}</h2>
            <p className="opacity-90 max-w-lg italic">{t('babylonQuote')}</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <Landmark size={200} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('totalSaved')}</h3>
              <div className="text-3xl font-bold mt-1 dark:text-white">{totalSaved.toLocaleString(locale)} FCFA</div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{t('globalProgress')}</span>
                        <span className="font-bold text-green-500">{overallProgress.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${overallProgress}%` }}></div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="lg:col-span-2 text-center py-12 dark:text-white">Chargement des objectifs...</div>
            ) : (
                goals.map((goal) => (
                    <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <Target className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg uppercase">
                                {goal.type}
                            </span>
                        </div>
            <h4 className="text-lg font-bold dark:text-white mb-1">{goal.name}</h4>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('target', { amount: goal.targetAmount.toLocaleString(locale) })}
            </div>

            <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="dark:text-gray-300">{goal.currentAmount.toLocaleString(locale)} FCFA</span>
                                <span className="font-bold text-blue-600">
                                    {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600"
                                    style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                {t('deposit')}
              </button>
              <button className="flex-1 py-2 text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                {t('details')}
              </button>
            </div>
                    </div>
                ))
            )}
        </div>
      </main>
    </div>
  );
}
