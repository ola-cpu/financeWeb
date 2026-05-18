"use client";
import { AUTH_USER_ID } from "@/lib/auth";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Target, Landmark, ShieldCheck, Trash2, Edit2, Wallet } from 'lucide-react';
import { savingsApi } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { SavingsGoalForm } from '@/components/forms/SavingsGoalForm';
import { useNotification } from '@/components/layout/NotificationProvider';

export default function SavingsPage() {
  const t = useTranslations('Savings');
  const locale = useLocale();
  const { notify } = useNotification();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchGoals = async () => {
    try {
      const userId = AUTH_USER_ID;
      const response = await savingsApi.getAll(userId);
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to fetch savings goals', error);
      notify('Erreur lors du chargement des objectifs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    setSubmitting(true);
    try {
      const userId = AUTH_USER_ID;
      if (editingGoal) {
        await savingsApi.update(editingGoal.id, data);
        notify('Objectif mis à jour', 'success');
      } else {
        await savingsApi.create({ ...data, user: { id: userId } });
        notify('Objectif créé', 'success');
      }
      setIsModalOpen(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      notify('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet objectif ?')) return;
    try {
      await savingsApi.delete(id);
      notify('Objectif supprimé', 'success');
      fetchGoals();
    } catch (error) {
      notify('Erreur lors de la suppression', 'error');
    }
  };

  const handleDeposit = async (id: number) => {
    const amount = prompt('Montant à déposer (FCFA):');
    if (!amount || isNaN(parseFloat(amount))) return;
    try {
      await savingsApi.deposit(id, parseFloat(amount));
      notify('Dépôt effectué !', 'success');
      fetchGoals();
    } catch (error) {
      notify('Erreur lors du dépôt', 'error');
    }
  };

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
          <button
            onClick={() => { setEditingGoal(null); setIsModalOpen(true); }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-bold"
          >
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full">
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
                <div className="h-full bg-green-500" style={{ width: `${Math.min(overallProgress, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="lg:col-span-2 text-center py-12 dark:text-white">Chargement...</div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Target className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingGoal(goal); setIsModalOpen(true); }} className="p-1 text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(goal.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h4 className="text-lg font-bold dark:text-white mb-1">{goal.name}</h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase text-xs">
                  {goal.type.replace('_', ' ')} • {goal.targetAmount.toLocaleString(locale)} FCFA
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

                <button
                  onClick={() => handleDeposit(goal.id)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Wallet size={16} />
                  {t('deposit')}
                </button>
              </div>
            ))
          )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingGoal(null); }} title={editingGoal ? "Modifier Objectif" : "Nouvel Objectif d'Épargne"}>
          <SavingsGoalForm
            initialData={editingGoal}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => { setIsModalOpen(false); setEditingGoal(null); }}
            loading={submitting}
          />
        </Modal>
      </main>
    </div>
  );
}
