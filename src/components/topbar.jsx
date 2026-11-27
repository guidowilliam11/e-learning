"use client";

import { usePathname } from 'next/navigation';
import Link from "next/link";
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const pageTitles = {
  '/': 'Dashboard',
  '/courses': 'My learning',
  '/notes': 'Notes',
  '/forum': 'Forum',
  '/schedule': 'Schedule',
  '/contact': 'Messages',
  '/settings': 'Settings',
  '/logout': 'Log out',
};

const DETAIL = { '/courses': 'Course player', '/forum': 'Thread', '/notes': 'Note' };

export default function TopBar() {
  const path = usePathname();
  const basePath = path.split('/')[1] ? `/${path.split('/')[1]}` : '/';
  const title = pageTitles[basePath] || 'Dashboard';
  const isNested = path !== basePath;
  // The date comes from the browser's clock, after hydration.
  const [today, setToday] = useState('');
  useEffect(() => setToday(dayjs().format('dddd, D MMMM YYYY')), []);

  return (
    <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-line shrink-0">
      <div className="flex items-center gap-2 text-sm">
        {isNested ? (
          <>
            <Link href={basePath} className="font-medium text-ink-3 hover:text-ink">{title}</Link>
            <span className="text-ink-3">/</span>
            <span className="font-medium text-ink">{DETAIL[basePath] || 'Details'}</span>
          </>
        ) : (
          <h1 className="text-base font-semibold text-ink">{title}</h1>
        )}
      </div>
      <p className="text-sm text-ink-3">{today}</p>
    </header>
  );
}
