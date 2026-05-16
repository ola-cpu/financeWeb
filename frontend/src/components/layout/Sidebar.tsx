'use client';

import React from 'react';
import { LayoutDashboard, Briefcase, MessageSquare, Settings, PieChart, LogOut, Award, Target } from 'lucide-react';
import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export function Sidebar() {
  const t = useTranslations('Sidebar');

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: t('dashboard'), href: '/' },
    { icon: <Briefcase size={20} />, label: t('portfolio'), href: '/portfolio' },
    { icon: <PieChart size={20} />, label: t('analysis'), href: '/analysis' },
    { icon: <Target size={20} />, label: t('fire'), href: '/fire' },
    { icon: <Award size={20} />, label: t('rewards'), href: '/rewards' },
    { icon: <MessageSquare size={20} />, label: t('aiCoach'), href: '/coach' },
    { icon: <Settings size={20} />, label: t('settings'), href: '/settings' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="font-bold text-xl dark:text-white">Babylon</span>
        </div>

        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href as any}
              className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 dark:border-gray-700">
        <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors w-full text-left">
          <LogOut size={20} />
          <span className="font-medium">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}
