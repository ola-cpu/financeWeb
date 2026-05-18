"use client";
import { AUTH_USER_ID } from "@/lib/auth";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Users, Calendar, ArrowRight, CheckCircle2, AlertCircle, Trash2, Edit2 } from 'lucide-react';
import { tontinesApi } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { TontineForm } from '@/components/forms/TontineForm';
import { useNotification } from '@/components/layout/NotificationProvider';

export default function TontinePage() {
  const t = useTranslations('Tontine');
  const locale = useLocale();
  const { notify } = useNotification();
  const [tontines, setTontines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTontine, setEditingTontine] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTontines = async () => {
    try {
      const userId = AUTH_USER_ID;
      const response = await tontinesApi.getAll(userId);
      setTontines(response.data);
    } catch (error) {
      console.error('Failed to fetch tontines', error);
      notify('Erreur lors du chargement des tontines', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTontines();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    setSubmitting(true);
    try {
      const userId = AUTH_USER_ID;
      if (editingTontine) {
        await tontinesApi.update(editingTontine.id, data);
        notify('Tontine mise à jour', 'success');
      } else {
        await tontinesApi.create({ ...data, creator: { id: userId } });
        notify('Tontine créée ! Invite tes amis.', 'success');
      }
      setIsModalOpen(false);
      setEditingTontine(null);
      fetchTontines();
    } catch (error) {
      notify('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette tontine ?')) return;
    try {
      await tontinesApi.delete(id);
      notify('Tontine supprimée', 'success');
      fetchTontines();
    } catch (error) {
      notify('Erreur lors de la suppression', 'error');
    }
  };

  const handleAddMember = async (tontineId: number) => {
    const name = prompt('Nom du nouveau membre :');
    if (!name) return;
    try {
      await tontinesApi.addMember(tontineId, { name });
      notify('Membre ajouté !', 'success');
      fetchTontines();
    } catch (error) {
      notify('Erreur lors de l\'ajout', 'error');
    }
  };

  const handlePayout = async (memberId: number) => {
    if (!confirm('Confirmer le paiement pour ce membre ?')) return;
    try {
      await tontinesApi.markPayoutDone(memberId);
      notify('Paiement validé !', 'success');
      fetchTontines();
    } catch (error) {
      notify('Erreur lors de la validation', 'error');
    }
  };

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
            onClick={() => { setEditingTontine(null); setIsModalOpen(true); }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-bold"
          >
            <Plus size={20} />
            {t('create')}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="lg:col-span-2 text-center py-12 dark:text-white">Chargement...</div>
          ) : tontines.length === 0 ? (
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-12 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
              <Users className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-bold dark:text-white mb-2">{t('noTontine')}</h3>
              <p className="text-gray-500 mb-6">{t('noTontineDesc')}</p>
              <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">{t('start')}</button>
            </div>
          ) : (
            tontines.map((tontine) => (
              <div
                key={tontine.id}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold dark:text-white mb-1">{tontine.name}</h3>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                    <Calendar size={16} />
                                    <span>{tontine.frequency} • {tontine.contributionAmount.toLocaleString(locale)} FCFA / membre</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingTontine(tontine); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-purple-600"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(tontine.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold dark:text-white flex items-center gap-2">
                      <Users size={18} />
                      {t('members')} ({tontine.members?.length || 0})
                    </h4>
                    <button onClick={() => handleAddMember(tontine.id)} className="text-xs font-bold text-purple-600 hover:underline">+ Ajouter</button>
                  </div>
                            <div className="grid grid-cols-2 gap-3">
                                {tontine.members?.map((member: any) => (
                                    <button
                                      key={member.id}
                                      onClick={() => !member.hasReceivedPayout && handlePayout(member.id)}
                                      disabled={member.hasReceivedPayout}
                                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="text-sm dark:text-gray-200">{member.name}</span>
                                        {member.hasReceivedPayout ? (
                                            <CheckCircle2 size={16} className="text-green-500" />
                                        ) : (
                                            <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50 mb-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase">
                      {t('nextBeneficiary')}
                    </div>
                    <div className="font-bold dark:text-white">
                      {tontine.members?.find((m: any) => !m.hasReceivedPayout)?.name || 'Aucun'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('totalPot')}</div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {(tontine.members?.length * tontine.contributionAmount).toLocaleString(locale)} FCFA
                  </div>
                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTontine(null); }} title={editingTontine ? "Modifier Tontine" : "Créer une Tontine"}>
          <TontineForm
            initialData={editingTontine}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => { setIsModalOpen(false); setEditingTontine(null); }}
            loading={submitting}
          />
        </Modal>
      </main>
    </div>
  );
}
