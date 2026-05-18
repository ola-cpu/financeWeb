"use client";

import React, { useState } from 'react';

export function AssetForm({ initialData, onSubmit, onCancel, loading }: any) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    type: 'STOCKS',
    value: '',
    expectedYield: '',
    riskLevel: 5,
  });

  const types = ['STOCKS', 'ETF', 'CRYPTO', 'REAL_ESTATE', 'CASH', 'BUSINESS', 'BONDS', 'GOLD', 'TONTINE'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      value: parseFloat(formData.value),
      expectedYield: parseFloat(formData.expectedYield || 0),
      riskLevel: parseInt(formData.riskLevel),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Nom de l'actif</label>
        <input
          type="text"
          required
          placeholder="ex: S&P 500, Immobilier Dakar..."
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Type</label>
          <select
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Valeur Actuelle (FCFA)</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Rendement Attendu (%)</label>
          <input
            type="number"
            step="0.1"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.expectedYield}
            onChange={(e) => setFormData({ ...formData, expectedYield: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Niveau de Risque (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-4"
            value={formData.riskLevel}
            onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
          />
          <div className="flex justify-between text-xs dark:text-gray-400 mt-1">
            <span>Prudent</span>
            <span>{formData.riskLevel}</span>
            <span>Audacieux</span>
          </div>
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
          {loading ? 'Enregistrement...' : 'Ajouter l\'actif'}
        </button>
      </div>
    </form>
  );
}
