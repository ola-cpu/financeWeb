"use client";

import React, { useState, useEffect } from 'react';

interface TransactionFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  type?: 'expense' | 'income';
}

export function TransactionForm({ initialData, onSubmit, onCancel, loading, type = 'expense' }: TransactionFormProps) {
  const [formData, setFormData] = useState(initialData || {
    description: '',
    amount: '',
    category: '',
    type: type,
    isRecurring: false,
    isFixed: false,
    date: ''
  });

  useEffect(() => {
    if (!initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [initialData]);

  const categories = type === 'expense'
    ? ['NOURRITURE', 'TRANSPORT', 'LOGEMENT', 'LOISIRS', 'SANTE', 'EDUCATION', 'AUTRE']
    : ['SALAIRE', 'FREELANCE', 'BUSINESS', 'DIVIDENDES', 'PASSIVE_INCOME', 'AUTRE'];

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
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Description</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Montant (FCFA)</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Catégorie</label>
          <select
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Sélectionner</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Date</label>
        <input
          type="date"
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Récurrent
        </label>
        {type === 'expense' && (
          <label className="flex items-center gap-2 text-sm dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFixed}
              onChange={(e) => setFormData({ ...formData, isFixed: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Fixe
          </label>
        )}
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
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
