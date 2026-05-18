"use client";
import { AUTH_USER_ID } from "@/lib/auth";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Briefcase, TrendingUp, Wallet, Trash2, Edit2 } from 'lucide-react';
import { assetsApi, transactionsApi } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { AssetForm } from '@/components/forms/AssetForm';
import { useNotification } from '@/components/layout/NotificationProvider';

export default function PortfolioPage() {
  const t = useTranslations('Portfolio');
  const locale = useLocale();
  const { notify } = useNotification();
  const [assets, setAssets] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const userId = AUTH_USER_ID;
      const [assetsRes, transRes] = await Promise.all([
        assetsApi.getAll(userId),
        transactionsApi.getAll(userId)
      ]);
      setAssets(assetsRes.data);
      setIncomes(transRes.data.filter((t: any) => t.type === 'income'));
    } catch (error) {
      console.error('Failed to fetch data', error);
      notify('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    setSubmitting(true);
    try {
      const userId = AUTH_USER_ID;
      if (editingAsset) {
        await assetsApi.update(editingAsset.id, data);
        notify('Actif mis à jour', 'success');
      } else {
        await assetsApi.create({ ...data, user: { id: userId } });
        notify('Actif ajouté', 'success');
      }
      setIsModalOpen(false);
      setEditingAsset(null);
      fetchData();
    } catch (error) {
      notify('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet actif ?')) return;
    try {
      await assetsApi.delete(id);
      notify('Actif supprimé', 'success');
      fetchData();
    } catch (error) {
      notify('Erreur lors de la suppression', 'error');
    }
  };

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const passiveTotal = incomes
    .filter(i => ['passive_income', 'dividends', 'immobilier', 'revenus_passifs'].includes(i.category?.toLowerCase()) || i.type === 'passive_income')
    .reduce((sum, i) => sum + i.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
          </div>
          <button
            onClick={() => { setEditingAsset(null); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-bold"
          >
            <Plus size={20} />
            Ajouter un Actif
          </button>
        </header>

        {loading ? (
            <div className="text-center p-12 dark:text-white">Chargement de votre trésor...</div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Wallet className="text-blue-500" />
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Valeur Totale des Actifs</span>
                        </div>
                        <div className="text-2xl font-bold dark:text-white">{totalAssets.toLocaleString(locale)} FCFA</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-green-500" />
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('monthlyPassive')}</span>
                        </div>
                        <div className="text-2xl font-bold dark:text-white">{passiveTotal.toLocaleString(locale)} FCFA</div>
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

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Nom</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Valeur</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Rendement</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {assets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 dark:text-white font-medium">{asset.name}</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">{asset.type}</span></td>
                                    <td className="px-6 py-4 dark:text-white font-bold">{asset.value.toLocaleString(locale)} FCFA</td>
                                    <td className="px-6 py-4 text-green-500">+{asset.expectedYield}%</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setEditingAsset(asset); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(asset.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingAsset(null); }} title={editingAsset ? "Modifier l'Actif" : "Ajouter un Actif"}>
            <AssetForm
                initialData={editingAsset}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => { setIsModalOpen(false); setEditingAsset(null); }}
                loading={submitting}
            />
        </Modal>
      </main>
    </div>
  );
}
