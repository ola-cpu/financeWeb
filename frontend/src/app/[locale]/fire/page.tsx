"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Target, TrendingUp, Calendar, Landmark } from 'lucide-react';
import { assetsApi } from '@/lib/api';

export default function FIREPage() {
  const t = useTranslations('FIRE');
  const locale = useLocale();
  const [fireData, setFireData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = 1;
        const annualExpenses = 50000; // Mock annual expenses
        const response = await assetsApi.getFIREStatus(userId, annualExpenses);
        setFireData(response.data);
      } catch (error) {
        console.error('Failed to fetch FIRE status', error);
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
          <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
        </header>

        {loading ? (
            <div className="text-center p-12 dark:text-white">Calculating your path to freedom...</div>
        ) : fireData ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <MetricCard
                        title={t('retirementAge')}
                        value={fireData.estimatedMonthsToRetire === 'N/A' ? 'N/A' : Math.round(fireData.estimatedMonthsToRetire / 12 + 30)}
                        icon={<Calendar className="text-blue-500" />}
                        description="Estimated age"
                    />
                    <MetricCard
                        title={t('capitalNecessary')}
                        value={`${fireData.fireNumber.toLocaleString(locale)} FCFA`}
                        icon={<Landmark className="text-purple-500" />}
                        description="4% rule target"
                    />
                    <MetricCard
                        title={t('requiredPassiveIncome')}
                        value={`${Math.round(fireData.requiredPassiveIncome).toLocaleString(locale)} FCFA`}
                        icon={<TrendingUp className="text-green-500" />}
                        description="Monthly target"
                    />
                    <MetricCard
                        title={t('safeWithdrawalRate')}
                        value={`${fireData.safeWithdrawalRate * 100}%`}
                        icon={<Target className="text-red-500" />}
                        description="Standard FIRE rule"
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-6 dark:text-white">Progression FEU</h3>
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                    {fireData.isFireReached ? 'GOAL REACHED' : 'PROGRESS'}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-blue-600">
                                    {Math.round(fireData.progress)}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-blue-200 dark:bg-gray-700">
                            <div style={{ width: `${Math.min(fireData.progress, 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        You have reached {Math.round(fireData.progress)}% of your financial independence goal. {fireData.estimatedMonthsToRetire !== 'N/A' && `Estimated ${fireData.estimatedMonthsToRetire} months to reach freedom.`}
                    </p>
                </div>
            </>
        ) : (
            <div className="text-center p-12 text-red-500">Failed to load FIRE data. Please try again later.</div>
        )}

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">The FEU Formula (FIRE)</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                FEU Capital = (Annual Expenses) / 0.04. This represents the amount you need to invest in order to live indefinitely off the returns, assuming a 4% safe withdrawal rate.
            </p>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon, description }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">{icon}</div>
            </div>
            <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h4>
            <div className="text-2xl font-bold mt-1 dark:text-white">{value}</div>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
    );
}
