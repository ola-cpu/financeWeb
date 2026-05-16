"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { AssetList, AddAssetModal } from '@/components/portfolio/AssetManagement';
import { Plus } from 'lucide-react';

export default function PortfolioPage() {
  const [assets, setAssets] = useState([
    { id: 1, name: 'Vanguard S&P 500', type: 'ETF', value: 25000, expectedYield: 8, riskLevel: 5 },
    { id: 2, name: 'Bitcoin', type: 'Crypto', value: 5400, expectedYield: 25, riskLevel: 9 },
    { id: 3, name: 'Emergency Fund', type: 'Savings', value: 12000, expectedYield: 4, riskLevel: 1 },
    { id: 4, name: 'Rental Property', type: 'Real Estate', value: 150000, expectedYield: 6, riskLevel: 4 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteAsset = (id: number) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">Your Portfolio</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your treasures and let them multiply.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
            Add Asset
          </button>
        </header>

        <AssetList assets={assets} onDelete={deleteAsset} />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative">
              <AddAssetModal />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
