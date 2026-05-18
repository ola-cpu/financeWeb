"use client";

import React, { useState } from 'react';

export function TontineForm({ initialData, onSubmit, onCancel, loading }: any) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    contributionAmount: '',
    frequency: 'MONTHLY',
    totalPot: 0,
  });

  const frequencies = [
    { value: 'WEEKLY', label: 'Hebdomadaire' },
    { value: 'MONTHLY', label: 'Mensuelle' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      contributionAmount: parseFloat(formData.contributionAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Nom de la Tontine</label>
        <input
          type="text"
          required
          placeholder="ex: Tontine des Amis"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Montant de la Contribution (FCFA)</label>
        <input
          type="number"
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.contributionAmount}
          onChange={(e) => setFormData({ ...formData, contributionAmount: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Fréquence</label>
        <select
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
        >
          {frequencies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
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
          className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer la Tontine'}
        </button>
      </div>
    </form>
  );
}
