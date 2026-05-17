"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Users, Calendar, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { axiosInstance } from '@/lib/api';

export default function TontinePage() {
  const t = useTranslations('Tontine');
  const locale = useLocale();
  const [tontines, setTontines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTontines() {
      try {
        const userId = 1;
        const response = await axiosInstance.get(`/tontines?userId=${userId}`);
        setTontines(response.data);
      } catch (error) {
        console.error('Failed to fetch tontines', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTontines();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
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
              <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">{t('start')}</button>
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
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-bold uppercase">
                                Actif
                            </span>
                        </div>

                <div className="space-y-4 mb-8">
                  <h4 className="font-bold dark:text-white flex items-center gap-2">
                    <Users size={18} />
                    {t('members')} ({tontine.members?.length || 0})
                  </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {tontine.members?.map((member: any) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <span className="text-sm dark:text-gray-200">{member.name}</span>
                                        {member.hasReceivedPayout ? (
                                            <CheckCircle2 size={16} className="text-green-500" />
                                        ) : (
                                            <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                                        )}
                                    </div>
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

                <button className="w-full py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  {t('viewDetails')}
                  <ArrowRight size={18} />
                </button>
                    </div>
                ))
            )}
        </div>
      </main>
    </div>
  );
}
