"use client"; // Mark this as a client component

import { usePathname } from 'next/navigation';
import Sidebar from '../components/sidebar';
import TopBar from '../components/topbar';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Define routes to exclude from the layout
  const excludedRoutes = ['/login', '/register'];

  // If the current route is excluded, render only the children
  if (excludedRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Default layout for other routes
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-grow h-screen">
        <TopBar />
        <main className="flex-grow overflow-y-auto p-4 bg-gray-100 h-[90%] font-inter">
          {children}
        </main>
      </div>
    </div>
  );
}
