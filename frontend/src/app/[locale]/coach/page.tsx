"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useTranslations } from 'next-intl';
import { MessageSquare, BrainCircuit, Sparkles } from 'lucide-react';
import { aiApi } from '@/lib/api';

export default function CoachPage() {
  const t = useTranslations('Coach');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
        const userData = { userId: 1 }; // Mock user data
        const response = await aiApi.getPsychologicalAdvice(userData);
        setAdvice(response.data);
    } catch (error) {
        console.error('Failed to fetch psychological advice', error);
        setAdvice("Alas, the oracle is silent. Check your connection to the Great Library.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
        </header>

        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <BrainCircuit />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold dark:text-white">Arkad II</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Psychological Financial Advisor</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 min-h-[300px] flex flex-col justify-center">
                    {advice ? (
                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
                                <Sparkles size={20} className="text-yellow-500 mb-2" />
                                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                                    {advice}
                                </p>
                            </div>
                            <button
                                onClick={() => setAdvice(null)}
                                className="text-sm text-blue-600 font-medium hover:underline"
                            >
                                Ask another question
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <MessageSquare size={48} className="text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                            <h4 className="text-xl font-medium mb-2 dark:text-white">Ready to analyze your patterns?</h4>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">Click below to let Arkad II analyze your recent behavior and provide personalized psychological guidance.</p>
                            <button
                                onClick={fetchAdvice}
                                disabled={loading}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Analyzing...' : t('getAdvice')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Card title={t('emotionalSpending')} value="Moderate" color="text-yellow-500" />
                <Card title={t('fearOfInvesting')} value="Low" color="text-green-500" />
                <Card title={t('impulsivity')} value="High" color="text-red-500" />
                <Card title={t('disciplineRoutines')} value="Improving" color="text-blue-500" />
            </div>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value, color }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h4>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
        </div>
    );
}
