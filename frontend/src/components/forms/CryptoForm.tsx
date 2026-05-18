"use client";

import React, { useState } from 'react';

export function CryptoForm({ initialData, onSubmit, onCancel, loading }: any) {
  const [formData, setFormData] = useState(initialData || {
    symbol: '',
    quantity: '',
    purchasePrice: '',
    currentValue: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice),
      currentValue: parseFloat(formData.currentValue || formData.purchasePrice),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Symbole (ex: BTC, ETH)</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Quantité</label>
          <input
            type="number"
            step="0.00000001"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">Prix d'achat (FCFA)</label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Valeur Actuelle (Optionnel - FCFA)</label>
        <input
          type="number"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.currentValue}
          onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
        />
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
          className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Ajouter l\'actif'}
        </button>
      </div>
    </form>
  );
}
