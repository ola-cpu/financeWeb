"use client";
import { AUTH_USER_ID } from "@/lib/auth";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, AlertCircle, CheckCircle2, Trash2, Edit2 } from 'lucide-react';
import { budgetApi } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Modal } from '@/components/ui/Modal';
import { BudgetForm } from '@/components/forms/BudgetForm';
import { useNotification } from '@/components/layout/NotificationProvider';

export default function BudgetPage() {
  const t = useTranslations('Budget');
  const locale = useLocale();
  const { notify } = useNotification();
  const [budgetStatus, setBudgetStatus] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBudgets = async () => {
    try {
      const userId = AUTH_USER_ID;
      const now = new Date();
      const [statusRes, allRes] = await Promise.all([
        budgetApi.getStatus(userId, now.getMonth() + 1, now.getFullYear()),
        budgetApi.getAll(userId)
      ]);
      setBudgetStatus(statusRes.data);
      setBudgets(allRes.data);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
      notify('Erreur lors du chargement des budgets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    setSubmitting(true);
    try {
      const userId = AUTH_USER_ID;
      if (editingBudget) {
        await budgetApi.update(editingBudget.id, data);
        notify('Budget mis à jour avec succès', 'success');
      } else {
        await budgetApi.create({ ...data, user: { id: userId } });
        notify('Budget créé avec succès', 'success');
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      fetchBudgets();
    } catch (error) {
      notify('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce budget ?')) return;
    try {
      await budgetApi.delete(id);
      notify('Budget supprimé', 'success');
      fetchBudgets();
    } catch (error) {
      notify('Erreur lors de la suppression', 'error');
    }
  };

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
          <button
            onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-bold"
          >
            <Plus size={20} />
            {t('define')}
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        ) : (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
                              : t('remaining', { amount: Math.max(0, b.remaining).toLocaleString(locale) })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <h3 className="text-lg font-semibold mb-6 dark:text-white">Liste des Budgets</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Catégorie</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Montant</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Période</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {budgets.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 dark:text-white font-medium uppercase">{b.category}</td>
                        <td className="px-6 py-4 dark:text-white font-bold">{b.amount.toLocaleString(locale)} FCFA</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{b.month}/{b.year}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setEditingBudget(b); setIsModalOpen(true); }}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(b.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingBudget(null); }}
          title={editingBudget ? "Modifier Budget" : "Définir Nouveau Budget"}
        >
          <BudgetForm
            initialData={editingBudget}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => { setIsModalOpen(false); setEditingBudget(null); }}
            loading={submitting}
          />
        </Modal>
      </main>
    </div>
  );
}
