'use client';

import {useLocale} from 'next-intl';
import {routing, usePathname, useRouter} from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLanguageChange(newLocale: string) {
    router.replace(pathname, {locale: newLocale});
  }

  return (
    <div className="flex gap-2 p-4">
      {routing.locales.map((cur) => (
        <button
          key={cur}
          onClick={() => onLanguageChange(cur)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            locale === cur
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {cur.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
