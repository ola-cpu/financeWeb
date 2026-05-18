"use client";
import { AUTH_USER_ID } from "@/lib/auth";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Search, Trash2, Edit2, Lock } from 'lucide-react';
import { transactionsApi } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useNotification } from '@/components/layout/NotificationProvider';

export default function ExpensesPage() {
  const t = useTranslations('Expenses');
  const locale = useLocale();
  const { notify } = useNotification();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchExpenses = async () => {
    try {
      const userId = AUTH_USER_ID;
      const response = await transactionsApi.getAll(userId);
      const filtered = response.data.filter((t: any) => t.type === 'expense');
      setExpenses(filtered);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
      notify('Erreur lors du chargement des dépenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    setSubmitting(true);
    try {
      const userId = AUTH_USER_ID;
      if (editingExpense) {
        await transactionsApi.update(editingExpense.id, data);
        notify('Dépense mise à jour', 'success');
      } else {
        await transactionsApi.create({ ...data, type: 'expense', user: { id: userId } });
        notify('Dépense ajoutée', 'success');
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      notify('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette dépense ?')) return;
    try {
      await transactionsApi.delete(id);
      notify('Dépense supprimée', 'success');
      fetchExpenses();
    } catch (error) {
      notify('Erreur lors de la suppression', 'error');
    }
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
            onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-bold"
          >
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
              {expenses.filter(e => e.isFixed).reduce((sum, exp) => sum + exp.amount, 0).toLocaleString(locale)} FCFA
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('variable')}</h3>
            <div className="text-2xl font-bold mt-1 dark:text-white">
              {expenses.filter(e => !e.isFixed).reduce((sum, exp) => sum + exp.amount, 0).toLocaleString(locale)} FCFA
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
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{t('category')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Montant</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center dark:text-white">Chargement...</td></tr>
              ) : filteredExpenses.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center dark:text-white">Aucune dépense trouvée.</td></tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 dark:text-white font-medium">{exp.description}</td>
                    <td className="px-6 py-4 uppercase font-bold text-xs">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                            {exp.category}
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingExpense(exp); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingExpense(null); }} title={editingExpense ? "Modifier Dépense" : "Ajouter Dépense"}>
          <TransactionForm
            initialData={editingExpense}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => { setIsModalOpen(false); setEditingExpense(null); }}
            loading={submitting}
            type="expense"
          />
        </Modal>
      </main>
    </div>
  );
}
