"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations } from 'next-intl';
import { DollarSign, Briefcase, TrendingUp, Wallet } from 'lucide-react';
import { assetsApi, transactionsApi } from '@/lib/api';

export default function PortfolioPage() {
  const t = useTranslations('Portfolio');
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [passiveTotal, setPassiveTotal] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = 1; // Assuming demo user ID
        const response = await transactionsApi.getAll(userId);
        const transactions = response.data;

        const incomeTransactions = transactions.filter((t: any) =>
          ['income', 'salary', 'freelance', 'business', 'passive_income', 'crypto_income', 'dividends'].includes(t.type)
        );

        const categorizedIncome = incomeTransactions.reduce((acc: any, curr: any) => {
          const type = curr.type === 'income' ? 'other' : curr.type.replace('_income', '');
          acc[type] = (acc[type] || 0) + curr.amount;
          return acc;
        }, {});

        const incomeList = Object.entries(categorizedIncome).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: value as number
        }));

        setIncomeData(incomeList);
        setTotalIncome(incomeList.reduce((acc, curr) => acc + curr.value, 0));
        setPassiveTotal(incomeList.filter(i => ['Passive', 'Dividends'].includes(i.name)).reduce((acc, curr) => acc + curr.value, 0));
      } catch (error) {
        console.error('Failed to fetch income data', error);
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
            <div className="text-center p-12 dark:text-white">Loading your gold...</div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="text-blue-500" />
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('totalCashFlow')}</span>
                        </div>
                        <div className="text-2xl font-bold dark:text-white">{totalIncome.toLocaleString()} FCFA</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-green-500" />
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('monthlyPassive')}</span>
                        </div>
                        <div className="text-2xl font-bold dark:text-white">{passiveTotal.toLocaleString()} FCFA</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Briefcase className="text-purple-500" />
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('financialFreedomProgression')}</span>
                        </div>
                        <div className="text-2xl font-bold dark:text-white">
                            {totalIncome > 0 ? Math.round((passiveTotal / totalIncome) * 100) : 0}%
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('incomeTracker')}</h3>
                        <div className="space-y-4">
                            {incomeData.length > 0 ? incomeData.map((item) => (
                                <div key={item.name} className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">{t(item.name.toLowerCase())}</span>
                                    <span className="font-bold dark:text-white">{item.value.toLocaleString()} FCFA</span>
                                </div>
                            )) : <p className="text-gray-500">No income streams yet.</p>}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('passiveincome')}</h3>
                        <div className="h-[300px] flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <Wallet size={48} className="mx-auto mb-2 opacity-20" />
                                <p>Visual representation of your passive gold</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
      </main>
    </div>
  );
}
