"use client";

// src/components/TopBar.js
import { usePathname } from 'next/navigation';
import { FaBell } from 'react-icons/fa';

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
    '/contact/peer/add': 'Contact'
  };

  const title = pageTitles[path] || 'Dashboard'; // Default to 'Dashboard' if path doesn't match

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200 h-[10%]">
      {/* Dynamic Title */}
      <h1 className="text-2xl font-semibold text-[#F99B26] min-w-40">{title}</h1>

      {/* Search bar */}
      <div className="flex items-center space-x-2 flex-grow mx-5">
        <input
          type="text"
          placeholder="search..."
          className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F99B26]"
        />
      </div>

      {/* Notification Icon */}
      <div className="text-[#F99B26] hover:text-orange-600">
        <FaBell size={24} />
      </div>
    </div>
  );
}
