"use client";
import { AUTH_USER_ID } from "@/lib/auth";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Search, Filter, Trash2, Edit2, Repeat } from 'lucide-react';
import { transactionsApi } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useNotification } from '@/components/layout/NotificationProvider';

export default function IncomesPage() {
  const t = useTranslations('Incomes');
  const locale = useLocale();
  const { notify } = useNotification();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchIncomes = async () => {
    try {
      const userId = AUTH_USER_ID;
      const response = await transactionsApi.getAll(userId);
      const incomeTypes = ['INCOME', 'SALARY', 'FREELANCE', 'BUSINESS', 'PASSIVE_INC', 'DIVIDENDS', 'SALAIRE', 'FREELANCE_FR', 'BUSINESS_FR', 'DIVIDENDES', 'PASSIVE_INCOME'];
      const filtered = response.data.filter((t: any) => incomeTypes.includes(t.category) || t.type === 'income');
      setIncomes(filtered);
    } catch (error) {
      console.error('Failed to fetch incomes', error);
      notify('Erreur lors du chargement des revenus', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    setSubmitting(true);
    try {
      const userId = AUTH_USER_ID;
      if (editingIncome) {
        await transactionsApi.update(editingIncome.id, data);
        notify('Revenu mis à jour', 'success');
      } else {
        await transactionsApi.create({ ...data, type: 'income', user: { id: userId } });
        notify('Revenu ajouté', 'success');
      }
      setIsModalOpen(false);
      setEditingIncome(null);
      fetchIncomes();
    } catch (error) {
      notify('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce revenu ?')) return;
    try {
      await transactionsApi.delete(id);
      notify('Revenu supprimé', 'success');
      fetchIncomes();
    } catch (error) {
      notify('Erreur lors de la suppression', 'error');
    }
  };

  const filteredIncomes = incomes.filter(inc =>
    inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <button
            onClick={() => { setEditingIncome(null); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-bold"
          >
            <Plus size={20} />
            {t('add')}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('monthlyTotal')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">
              {incomes.reduce((sum, inc) => sum + inc.amount, 0).toLocaleString(locale)} FCFA
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('activeSources')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">{new Set(incomes.map((i) => i.category)).size}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('recurring')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">{incomes.filter((i) => i.isRecurring).length}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('search')}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('desc')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('type')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('amount')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Récurrent</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center dark:text-white">Chargement...</td></tr>
              ) : filteredIncomes.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center dark:text-white">Aucun revenu trouvé.</td></tr>
              ) : (
                filteredIncomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 dark:text-white font-medium">{inc.description}</td>
                    <td className="px-6 py-4 uppercase">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                            {inc.category}
                        </span>
                    </td>
                    <td className="px-6 py-4 dark:text-white font-bold">{inc.amount.toLocaleString(locale)} FCFA</td>
                    <td className="px-6 py-4">
                        {inc.isRecurring ? <Repeat size={18} className="text-blue-500" /> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingIncome(inc); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(inc.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingIncome(null); }} title={editingIncome ? "Modifier Revenu" : "Ajouter Revenu"}>
          <TransactionForm
            initialData={editingIncome}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => { setIsModalOpen(false); setEditingIncome(null); }}
            loading={submitting}
            type="income"
          />
        </Modal>
      </main>
    </div>
  );
}
