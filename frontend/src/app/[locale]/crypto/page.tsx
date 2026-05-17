"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Bitcoin, TrendingUp, TrendingDown, PieChart, ShieldCheck } from 'lucide-react';
import { axiosInstance } from '@/lib/api';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CryptoPage() {
  const t = useTranslations('Crypto');
  const locale = useLocale();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCrypto() {
      try {
        const userId = 1;
        const response = await axiosInstance.get(`/crypto/portfolio?userId=${userId}`);
        setPortfolio(response.data);
      } catch (error) {
        console.error('Failed to fetch crypto portfolio', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCrypto();
  }, []);

  const totalValue = portfolio.reduce((sum, c) => sum + c.currentValue, 0);
  const totalProfitLoss = portfolio.reduce((sum, c) => sum + c.profitLoss, 0);
  const totalProfitLossPercentage = totalValue > 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0;

  const chartData = portfolio.map(c => ({
    name: c.symbol,
    value: c.currentValue
  }));

  const COLORS = ['#F7931A', '#627EEA', '#26A17B', '#8C8C8C', '#345D9D'];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-bold">
            <Plus size={20} />
            {t('add')}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('totalValue')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">{totalValue.toLocaleString(locale)} FCFA</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('profitLoss')}</h3>
            <div
              className={`text-2xl font-bold mt-1 flex items-center gap-2 ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {totalProfitLoss >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              {Math.abs(totalProfitLoss).toLocaleString(locale)} FCFA
              <span className="text-sm">({totalProfitLossPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('riskManagement')}</h3>
            <div className="flex items-center gap-2 mt-2 text-green-500 font-bold">
              <ShieldCheck size={20} />
              <span>{t('diversified')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('asset')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('quantity')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('avgPrice')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('currentValue')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('profitLoss')}</th>
            </tr>
          </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center dark:text-white">Chargement...</td></tr>
                        ) : portfolio.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center dark:text-white">Aucun actif trouvé.</td></tr>
                        ) : (
                            portfolio.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600">
                                                <Bitcoin size={18} />
                                            </div>
                                            <span className="font-bold dark:text-white">{c.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 dark:text-white">{c.quantity}</td>
                                    <td className="px-6 py-4 dark:text-white">{c.purchasePrice.toLocaleString(locale)} FCFA</td>
                                    <td className="px-6 py-4 dark:text-white font-bold">{c.currentValue.toLocaleString(locale)} FCFA</td>
                                    <td className={`px-6 py-4 font-bold ${c.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {c.profitLoss >= 0 ? '+' : ''}{c.profitLoss.toLocaleString(locale)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6 dark:text-white flex items-center gap-2">
            <PieChart size={20} className="text-blue-500" />
            {t('allocation')}
          </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

// Fixing RechartsPie naming conflict with Lucide icon
function RechartsPieChart({ children }: { children: React.ReactNode }) {
    return <RechartsPie>{children}</RechartsPie>;
}
