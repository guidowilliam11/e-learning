"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronRight, FaHome, FaBook, FaStickyNote, FaUsers, FaCalendar, FaAddressBook, FaChevronLeft } from 'react-icons/fa';
import { IoLogOut, IoSettingsSharp, IoIosArrowBack } from "react-icons/io5";

// Dummy notes data for users
const notesData = [
    {
        topic: "Topic 001",
        sessions: [
            { id: 1, title: "Session 1", content: "Content for session 1 of Topic 001." },
            { id: 2, title: "Session 2", content: "Content for session 2 of Topic 001." },
            { id: 3, title: "Session 3", content: "Content for session 3 of Topic 001." },
        ],
    },
    {
        topic: "Topic 002",
        sessions: [
            { id: 4, title: "Session 1", content: "Content for session 1 of Topic 002." },
            { id: 5, title: "Session 2", content: "Content for session 2 of Topic 002." },
        ],
    },
    {
        topic: "Topic 003",
        sessions: [
            { id: 6, title: "Session 1", content: "Content for session 1 of Topic 003." },
            { id: 7, title: "Session 2", content: "Content for session 2 of Topic 003." },
            { id: 8, title: "Session 3", content: "Content for session 3 of Topic 003." },
            { id: 9, title: "Session 4", content: "Content for session 4 of Topic 003." },
        ],
    },
    // Add more topics and sessions as needed
];

export default function Sidebar() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [expandedTopics, setExpandedTopics] = useState({});
    const [selectedSession, setSelectedSession] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    // Toggle overlay when navigating to notes
    const handleNavClick = (path) => {
        if (path.startsWith('/notes')) {
            setShowOverlay(true);

            // Extract the session ID from the path if needed
            const sessionId = path.split('/').pop(); // Get the last part of the path
            setSelectedSession(parseInt(sessionId, 10)); // Set the selected session ID
        } else {
            setShowOverlay(false);
            setSelectedSession(null); // Clear selected session when navigating away
        }
    };

    // Toggle topic expansion
    const toggleTopic = (topic) => {
        setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
    };

    return (
        <div className={`relative flex h-screen drop-shadow-xl transition-all duration-300 ${isSidebarCollapsed ? 'w-10' : 'w-80'} group`}>
            {/* Arrow Button */}
            <button
                onClick={toggleSidebar}
                className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 z-20 transition-all duration-300 rounded-full bg-[#F99B26] p-1 
        ${isSidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'} group-hover:opacity-100 group-hover:pointer-events-auto`}
            >
                {isSidebarCollapsed ? <FaChevronRight className="text-white text-base" /> : <FaChevronLeft className="text-white text-base2" />}
            </button>
            {/* Sidebar */}
            <aside className={`relative bg-gray-100 h-full p-5 flex flex-col justify-between transition-all duration-300 ${isSidebarCollapsed ? 'w-10' : 'w-80'}`}>


                {/* Sidebar Content */}
                <div className={`transition-all ${isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto duration-500'} h-full flex flex-col justify-between transition-all `}>
                    {/* Overlay */}
                    {showOverlay && (
                        <div className="absolute inset-0 bg-gray-100 flex flex-col z-10 p-5 items-start">
                            <button
                                onClick={() => setShowOverlay(false)}
                                className=" text-[#F99B26] font-semibold"
                            >
                                <span className="flex justify-center gap-2 items-center text-3xl font-bold text-[#F99B26] mb-8 pt-4">{<FaChevronLeft />} Notes</span>
                            </button>
                            {notesData.map((topic) => (
                                <div key={topic.topic} className="mb-4 w-full">
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleTopic(topic.topic)}
                                    >
                                        <span className="font-medium">{topic.topic}</span>
                                        {expandedTopics[topic.topic] ? <FaChevronDown /> : <FaChevronRight />}
                                    </div>
                                    {expandedTopics[topic.topic] && (
                                        <ul className="mt-2 ml-4 space-y-1">
                                            {topic.sessions.map((session) => (
                                                <li
                                                    key={session.id}
                                                    className={`cursor-pointer ${selectedSession === session.id ? 'font-medium text-[#F99B26]' : 'text-gray-700'}`}
                                                    onClick={() => setSelectedSession(session.id)}
                                                >
                                                    <NavItem href={"/notes/" + session.id} icon={<FaBook />} label={session.title} onClick={handleNavClick} />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`${showOverlay ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
                        {/* Logo */}
                        <div className="text-3xl font-bold text-[#F99B26] mb-8 pt-4">Notilde ~</div>

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
                            <NavItem href="/" icon={<FaHome />} label="Dashboard" onClick={handleNavClick} />
                            <NavItem href="/courses" icon={<FaBook />} label="Courses" onClick={handleNavClick} />
                            <NavItem href="/notes" icon={<FaStickyNote />} label="Notes" onClick={handleNavClick} />
                            <NavItem href="/forum" icon={<FaUsers />} label="Forum" onClick={handleNavClick} />
                            <NavItem href="/schedule" icon={<FaCalendar />} label="Schedule" onClick={handleNavClick} />
                            <NavItem href="/contact" icon={<FaAddressBook />} label="Contact" onClick={handleNavClick} />
                        </nav>
                    </div>

                    <div className={`space-y-4 ${showOverlay ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
                        <NavItem href="/settings" icon={<IoSettingsSharp />} label="Settings & Privacy" onClick={handleNavClick} />
                        <NavItem href="/logout" icon={<IoLogOut />} label="Logout" onClick={handleNavClick} />
                    </div>
                </div>
            </aside>
        </div>
    );
}

function NavItem({ href, icon, label, onClick }) {
    const isLogout = label === "Logout";

    return (
        <div onClick={() => onClick(href)} className="w-full">
            <Link
                href={href}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isLogout ? 'text-red-500 hover:bg-red-100' : 'text-gray-700 hover:bg-gray-200'
                    }`}
            >
                <span className="text-xl">{icon}</span>
                <span className={`font-medium ${isLogout ? 'text-red-500' : ''}`}>{label}</span>
            </Link>
        </div>
    );
}