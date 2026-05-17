"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Search, Filter, ArrowDownRight, Repeat, Lock } from 'lucide-react';
import { transactionsApi } from '@/lib/api';

export default function ExpensesPage() {
  const t = useTranslations('Expenses');
  const locale = useLocale();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const userId = 1;
        const response = await transactionsApi.getAll(userId);
        // Filter for expense types
        const expenseTypes = ['expense', 'nourriture', 'transport', 'logement', 'loisirs', 'sante', 'education'];
        const filtered = response.data.filter((t: any) => t.type === 'expense' || expenseTypes.includes(t.type));
        setExpenses(filtered);
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter(exp =>
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp.category && exp.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
            <Plus size={20} />
            {t('add')}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('monthlyTotal')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">
              {expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString(locale)} FCFA
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('fixed')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">
              {expenses
                .filter((e) => e.isFixed)
                .reduce((sum, exp) => sum + exp.amount, 0)
                .toLocaleString(locale)}{' '}
              FCFA
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('variable')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">
              {expenses
                .filter((e) => !e.isFixed)
                .reduce((sum, exp) => sum + exp.amount, 0)
                .toLocaleString(locale)}{' '}
              FCFA
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('search')}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter size={18} />
              Filtres
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('category')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Montant</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center dark:text-white">Chargement des dépenses...</td></tr>
              ) : filteredExpenses.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center dark:text-white">Aucune dépense trouvée.</td></tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 dark:text-white font-medium">{exp.description}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium uppercase">
                            {exp.category || exp.type}
                        </span>
                    </td>
                    <td className="px-6 py-4 dark:text-white font-bold">{exp.amount.toLocaleString(locale)} FCFA</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {exp.isFixed ? <Lock size={14} className="text-gray-400" /> : <span className="w-[14px]"></span>}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {exp.isFixed ? t('fixe') : t('vari')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(exp.date).toLocaleDateString(locale)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
