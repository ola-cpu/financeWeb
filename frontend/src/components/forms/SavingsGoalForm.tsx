"use client";

import React, { useState } from 'react';

export function SavingsGoalForm({ initialData, onSubmit, onCancel, loading }: any) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    type: 'emergency_fund',
  });

  const types = [
    { value: 'emergency_fund', label: 'Fonds d\'urgence' },
    { value: 'investment', label: 'Investissement' },
    { value: 'purchase', label: 'Achat important' },
    { value: 'retirement', label: 'Retraite' },
    { value: 'other', label: 'Autre' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Nom de l'objectif</label>
        <input
          type="text"
          required
          placeholder="ex: Fonds d'urgence 6 mois"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Montant Cible (FCFA)</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Montant Actuel (FCFA)</label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
            value={formData.currentAmount}
            onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Date Limite</label>
        <input
          type="date"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Type</label>
        <select
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
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
          className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer l\'objectif'}
        </button>
      </div>
    </form>
  );
}
