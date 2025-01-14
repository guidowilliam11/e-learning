"use client";

// src/components/TopBar.js
import { usePathname } from 'next/navigation';
import Link from "next/link";

export default function TopBar() {
  const path = usePathname();

  // Determine title based on path
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/courses': 'Courses',
    '/notes': 'Notes',
    '/forum': 'Forum',
    '/schedule': 'Schedule',
    '/contact': 'Contact',
    '/contact/community': 'Contact',
    '/contact/community/add': 'Contact',
    '/contact/community/edit': 'Contact',
    '/contact/peer': 'Contact',
    '/contact/peer/add': 'Contact',
    '/settings': 'Settings',
    '/logout': 'Logout'
  };

  const basePath = path.split('/')[1] ? `/${path.split('/')[1]}` : '/';

  const title = pageTitles[basePath] || 'Dashboard'; // Default to 'Dashboard' if path doesn't match

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200 h-[10%]">
      {/* Dynamic Title */}
      <Link href={basePath} passHref>
        <h1 className="text-2xl font-semibold text-[#F99B26] min-w-40 cursor-pointer hover:underline">
          {title}
        </h1>
      </Link>
    </div>
  );
}
