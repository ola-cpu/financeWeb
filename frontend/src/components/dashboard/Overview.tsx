import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Wallet, TrendingUp, Shield, Target, PiggyBank, ArrowDownCircle, ArrowUpCircle, Banknote } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DashboardOverview({ data }: any) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const {
    netWorth = 0,
    monthlyChange = '+0%',
    healthScore = 0,
    totalSavings = 0,
    budgetRemaining = 0,
    passiveIncome = 0,
    savingsRate = 0,
  } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <Card
        title={t('netWorth')}
        value={`${netWorth.toLocaleString(locale)} FCFA`}
        change={monthlyChange}
        icon={<Wallet className="text-blue-500" />}
      />
      <Card
        title={t('healthScore')}
        value={`${healthScore}/100`}
        description={t('babylonianCompliance')}
        icon={<Shield className="text-green-500" />}
      />
      <Card
        title="Total Épargne"
        value={`${totalSavings.toLocaleString(locale)} FCFA`}
        icon={<PiggyBank className="text-teal-500" />}
      />
      <Card
        title="Budget Restant"
        value={`${budgetRemaining.toLocaleString(locale)} FCFA`}
        icon={<Banknote className="text-orange-500" />}
      />
      <Card
        title="Revenus Passifs"
        value={`${passiveIncome.toLocaleString(locale)} FCFA`}
        icon={<TrendingUp className="text-purple-500" />}
      />
      <Card
        title={t('savingsRate')}
        value={`${savingsRate.toFixed(1)}%`}
        description={t('savingsGoal')}
        icon={<Target className="text-yellow-500" />}
      />
    </div>
  );
}

function Card({ title, value, change, description, icon }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">{icon}</div>
        {change && (
          <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <div className="text-2xl font-bold mt-1 dark:text-white">{value}</div>
      {description && <p className="text-gray-400 text-xs mt-1">{description}</p>}
    </div>
  );
}

export function AssetAllocationChart({ data }: any) {
  const t = useTranslations('Dashboard');
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[400px] min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">{t('assetAllocation')}</h3>
      <ResponsiveContainer width="99%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WealthProgressionChart({ data }: any) {
  const t = useTranslations('Dashboard');
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[400px] min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Évolution du Patrimoine</h3>
      <ResponsiveContainer width="99%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k FCFA`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 4, fill: '#10B981' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IncomeVsExpenseChart({ data }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[400px] min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Revenus vs Dépenses</h3>
      <ResponsiveContainer width="99%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
          <Bar dataKey="income" name="Revenus" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Dépenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
