// components/Sidebar.js
import Link from 'next/link';
import { FaHome, FaBook, FaStickyNote, FaUsers, FaCalendar, FaAddressBook } from 'react-icons/fa';
import { IoLogOut, IoSettingsSharp } from "react-icons/io5";


export default function Sidebar() {
    return (
        <aside className="min-w-80 bg-gray-100 h-screen p-5 flex flex-col justify-between">
            <div>
                {/* Logo */}
                <div className="text-3xl font-bold text-[#F99B26] mb-8">ZEAL.</div>

                <div className="h-36 bg-gradient-to-br from-[#F99B26] to-[#943500] text-white p-4 rounded-lg mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-lg font-semibold">John Doe</p>
                        <button className="bg-[#F99B26] px-3 py-1 text-sm rounded-md">Switch</button>
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
            </div>

            <div className="space-y-4">
                <NavItem href="/settings" icon={<IoSettingsSharp />} label="Settings & Privacy" />
                <NavItem href="/logout" icon={<IoLogOut />} label="Logout" />
            </div>
        </aside>
    );
}


function NavItem({ href, icon, label }) {
    const isLogout = label === "Logout";

    return (
        <Link
            href={href}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isLogout ? 'text-red-500 hover:bg-red-100' : 'text-gray-700 hover:bg-gray-200'
                }`}
        >
            <span className="text-xl">{icon}</span>
            <span className={`font-medium ${isLogout ? 'text-red-500' : ''}`}>{label}</span>
        </Link>
    );
}
