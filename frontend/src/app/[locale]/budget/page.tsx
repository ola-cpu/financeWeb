"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { axiosInstance } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function BudgetPage() {
  const t = useTranslations('Budget');
  const locale = useLocale();
  const [budgetStatus, setBudgetStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudgetStatus() {
      try {
        const userId = 1;
        const now = new Date();
        const response = await axiosInstance.get(
          `/budget/status?userId=${userId}&month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
        );
        setBudgetStatus(response.data);
      } catch (error) {
        console.error('Failed to fetch budget status', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBudgetStatus();
  }, []);

  const totalPlanned = budgetStatus.reduce((sum, b) => sum + b.planned, 0);
  const totalActual = budgetStatus.reduce((sum, b) => sum + b.actual, 0);
  const totalPercentage = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
            <Plus size={20} />
            {t('define')}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('totalPlanned')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">{totalPlanned.toLocaleString(locale)} FCFA</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('totalActual')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">{totalActual.toLocaleString(locale)} FCFA</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('percentageUsed')}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-2xl font-bold dark:text-white">{totalPercentage.toFixed(1)}%</div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${totalPercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6 dark:text-white">{t('comparison')}</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="planned" name={t('planned')} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name={t('actual')} fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6 dark:text-white">{t('alerts')}</h3>
            <div className="space-y-4">
              {budgetStatus.length === 0 ? (
                <p className="text-gray-500 italic">{t('noData')}</p>
              ) : (
                budgetStatus.map((b) => (
                  <div
                    key={b.category}
                    className="p-4 rounded-xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium dark:text-white capitalize">{b.category}</span>
                      <span className={`text-sm font-bold ${b.percentage > 100 ? 'text-red-500' : 'text-green-500'}`}>
                        {b.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.percentage > 100 ? (
                        <AlertCircle size={16} className="text-red-500" />
                      ) : (
                        <CheckCircle2 size={16} className="text-green-500" />
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {b.percentage > 100
                          ? t('overrun', { amount: (b.actual - b.planned).toLocaleString(locale) })
                          : t('remaining', { amount: b.remaining.toLocaleString(locale) })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
