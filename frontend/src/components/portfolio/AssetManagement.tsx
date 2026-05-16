import React from 'react';
import { Plus, Trash2, Edit2, Info } from 'lucide-react';

export function AssetList({ assets, onDelete }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Asset Name</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Value</th>
              <th className="px-6 py-4 font-semibold">Yield</th>
              <th className="px-6 py-4 font-semibold">Risk</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {assets.map((asset: any) => (
              <tr key={asset.id} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4 font-medium">{asset.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">{asset.type}</span>
                </td>
                <td className="px-6 py-4">{asset.value.toLocaleString()} FCFA</td>
                <td className="px-6 py-4 text-green-500">+{asset.expectedYield}%</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${asset.riskLevel < 4 ? 'bg-green-500' : asset.riskLevel < 7 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                    {asset.riskLevel}/10
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(asset.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AddAssetModal({ onAdd }: any) {
  // Simplified for now
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-md w-full">
      <h3 className="text-xl font-bold mb-6 dark:text-white">Add New Asset</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="e.g. S&P 500 ETF" />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option>Stocks</option>
              <option>Crypto</option>
              <option>Real Estate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valeur (FCFA)</label>
            <input type="number" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="0.00" />
          </div>
        </div>
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-4">
          Add Gold to your Purse
        </button>
      </form>
    </div>
  );
}
