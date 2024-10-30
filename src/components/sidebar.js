// components/Sidebar.js
import Link from 'next/link';
import { FaHome, FaBook, FaStickyNote, FaUsers, FaCalendar, FaAddressBook } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-5 flex flex-col">
      {/* Logo */}
      <div className="text-3xl font-bold text-orange-500 mb-8">ZEAL.</div>
      
      {/* Profile Card */}
      <div className="bg-orange-500 text-white p-4 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold">John Doe</p>
          <button className="bg-orange-600 px-3 py-1 text-sm rounded-md">Switch</button>
        </div>
        <p className="font-bold">Student</p>
        <p className="text-sm">undergraduate<br />BINUS University</p>
      </div>
      
      {/* Navigation Links */}
      <nav className="space-y-4">
        <NavItem href="/" icon={<FaHome />} label="Dashboard" />
        <NavItem href="/courses" icon={<FaBook />} label="Courses" />
        <NavItem href="/notes" icon={<FaStickyNote />} label="Notes" />
        <NavItem href="/forum" icon={<FaUsers />} label="Forum" />
        <NavItem href="/schedule" icon={<FaCalendar />} label="Schedule" />
        <NavItem href="/contact" icon={<FaAddressBook />} label="Contact" />
      </nav>
    </aside>
  );
}

function NavItem({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center space-x-3 text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition-colors">
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
