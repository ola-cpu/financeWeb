"use client";

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

interface BudgetFormProps {
  initialData?: {
    category: string;
    amount: number | string;
    month: number;
    year: number;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

export function BudgetForm({ initialData, onSubmit, onCancel, loading }: BudgetFormProps) {
  const locale = useLocale();
  const [formData, setFormData] = useState(initialData || {
    category: '',
    amount: '',
    month: 1,
    year: 2024,
  });

  useEffect(() => {
    if (!initialData) {
      const now = new Date();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({
        ...prev,
        month: now.getMonth() + 1,
        year: now.getFullYear()
      }));
    }
  }, [initialData]);

  const categories = ['NOURRITURE', 'TRANSPORT', 'LOGEMENT', 'LOISIRS', 'SANTE', 'EDUCATION', 'AUTRE'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Catégorie</label>
        <select
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="">Sélectionner</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Montant Alloué (FCFA)</label>
        <input
          type="number"
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Mois</label>
          <select
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString(locale, { month: 'long' })}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Année</label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'Chargement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
