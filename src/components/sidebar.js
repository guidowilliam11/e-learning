"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FaChevronDown,
    FaChevronRight,
    FaHome,
    FaBook,
    FaStickyNote,
    FaUsers,
    FaCalendar,
    FaAddressBook,
    FaChevronLeft
} from 'react-icons/fa';
import { IoLogOut, IoSettingsSharp, IoIosArrowBack } from "react-icons/io5";
import { FaPlus, FaX } from "react-icons/fa6";
import LogoutConfirmationDialog from '@/app/(auth)/logout/component/LogoutConfirmationDialog';
import { redirect, usePathname } from 'next/navigation';
import { toast } from "react-toastify";

// Dummy notes data for users

export default function Sidebar() {
    const pathname = usePathname() // returns "/ dashboard" on / dashboard?foo=bar

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [expandedTopics, setExpandedTopics] = useState({});
    const [selectedSession, setSelectedSession] = useState(null);
    const [notesData, setNotesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredFolder, setHoveredFolder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [reload, setReload] = useState(false);
    const [noteInputVisible, setNoteInputVisible] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [sessionData, setSessionData] = useState({});
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleAddNote = (folderId) => {
        setNoteInputVisible(folderId);
        setNewNote('');
    };

    async function addNote(folderId, newNote) {
        try {
            const response = await fetch('/api/folder/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderId, newNote }),
            });

            if (response.ok) {
                setReload((prev) => !prev);
                toast.success("Successfully created note")
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating note:', error);
            toast.error("Error creating note")
        }
    }

    const saveNote = (folderId) => {
        if (!newNote.trim()) {
            toast.error("Note can't be empty")
            return;
        }
        addNote(folderId, newNote);
        setNoteInputVisible(null);
        setNewNote('');
    };


    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    const handleAddFolder = async () => {
        if (!folderName.trim()) {
            toast.error("Folder name can't be empty")
            return;
        }
        try {
            const response = await fetch('/api/folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderName }),
            });

            if (response.ok) {
                const data = await response.json();
                setFolderName('');
                setIsEditing(false);

                setReload((prev) => !prev);
                toast.success("Successfully created folder")
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            toast.error("Error creating folder")
        }
    };

    useEffect(() => {
        if (Object.keys(sessionData).length === 0) {
            const interval = setInterval(() => {
                const currentData = JSON.parse(localStorage.getItem('userDetails')) || {};
                if (JSON.stringify(currentData) !== JSON.stringify(sessionData)) {
                    setSessionData(currentData);
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, [sessionData]);

    // Fetch notes data
    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/folder');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setNotesData(data);
                if (pathname.startsWith('/notes/')) {
                    console.log(pathname);
                    setShowOverlay(true);
                }
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [reload]);

    // Toggle overlay when navigating to notes
    const handleNavClick = (path) => {
        if (path.startsWith('/notes')) {
            console.log(pathname);
            // setShowOverlay(true);

            // Extract the session ID from the path if needed
            const sessionId = path.split('/').pop(); // Get the last part of the path
            setSelectedSession(parseInt(sessionId, 10)); // Set the selected session ID
        } else {
            setShowOverlay(false);
            setSelectedSession(null); // Clear selected session when navigating away
        }

        if (path === '') {
            setOpenLogoutDialog(true)
        }
    };

    const handleCancelLogout = () => setOpenLogoutDialog(false)
    const handleConfirmLogout = () => {
        setOpenLogoutDialog(false)
        redirect('/logout')
    }

    // Toggle topic expansion
    const toggleTopic = (topic) => {
        setExpandedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
    };

    return (<div
        className={`relative flex h-screen drop-shadow-xl transition-all duration-300 ${isSidebarCollapsed ? 'w-10' : 'w-80'} group`}>
        {/* Arrow Button */}
        <button
            onClick={toggleSidebar}
            className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 z-20 transition-all duration-300 rounded-full bg-[#F99B26] p-1 
        ${isSidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'} group-hover:opacity-100 group-hover:pointer-events-auto`}
        >
            {isSidebarCollapsed ? <FaChevronRight className="text-base text-white" /> :
                <FaChevronLeft className="text-white text-base2" />}
        </button>
        {/* Sidebar */}
        <aside
            className={`relative bg-gray-100 h-full p-5 flex flex-col justify-between transition-all duration-300 ${isSidebarCollapsed ? 'w-10' : 'w-80'}`}>

            {/* Sidebar Content */}
            <div
                className={`transition-all ${isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto duration-500'} h-full flex flex-col justify-between transition-all `}>
                {/* Overlay */}
                {showOverlay && (
                    <div
                        className="absolute inset-0 z-10 flex flex-col items-start p-5 bg-gray-100">
                        <button
                            onClick={() => setShowOverlay(false)}
                            className="text-[#F99B26] font-semibold"
                        >
                            <span
                                className="flex justify-center gap-2 items-center text-3xl font-bold text-[#F99B26] mb-8 pt-4">
                                {<FaChevronLeft />} Notes
                            </span>
                        </button>
                        {notesData.notes.map((folder) => (
                            <div
                                key={folder._id}
                                className="w-full mb-4"
                                onMouseEnter={() => setHoveredFolder(folder._id)}
                                onMouseLeave={() => setHoveredFolder(null)}
                            >
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleTopic(folder._id)}
                                >
                                    <span className="font-medium">{folder.name}</span>
                                    <div className="flex items-center">
                                        <button
                                            id={folder._id}
                                            className={` mr-2 transition-opacity duration-200 ${hoveredFolder === folder._id ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddNote(folder._id);
                                            }}
                                        >
                                            <FaPlus />
                                        </button>
                                        {expandedTopics[folder._id] ? <FaChevronDown /> : <FaChevronRight />}
                                    </div>
                                </div>

                                {expandedTopics[folder._id] && (
                                    <ul className="mt-2 ml-4 space-y-1">
                                        {folder.notes.map((notes) => (
                                            <li
                                                key={notes._id}
                                                className={`cursor-pointer ${selectedSession === notes._id ? 'font-medium text-[#F99B26]' : 'text-gray-700'
                                                    }`}
                                                onClick={() => setSelectedSession(notes._id)}
                                            >
                                                <NavItem
                                                    href={"/notes/" + notes._id}
                                                    icon={<FaBook />}
                                                    label={notes.topic}
                                                    onClick={handleNavClick}
                                                />
                                            </li>
                                        ))}
                                        {noteInputVisible === folder._id && ( // Conditional rendering for the input field
                                            <li>
                                                <div className="flex items-center p-2 space-x-3 text-gray-700 transition-colors rounded-lg hover:bg-gray-200">
                                                    <span className="text-xl"><FaBook></FaBook></span>
                                                    <input
                                                        type="text"
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                        placeholder="Type new note..."
                                                        className="flex-1 bg-foreground focus:outline-none"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') saveNote(folder._id);
                                                        }}
                                                    />
                                                    <button
                                                        className="p-1 font-semibold text-gray-700 rounded hover:bg-gray-300"
                                                        onClick={() => setNoteInputVisible(null)}
                                                    >
                                                        <FaX></FaX>
                                                    </button>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        ))}

                        <div className="w-full mt-2">
                            {isEditing ? (
                                <div className="flex items-center p-2 border rounded-md">
                                    <input
                                        type="text"
                                        value={folderName}
                                        onChange={(e) => setFolderName(e.target.value)}
                                        placeholder="Enter folder name"
                                        className="flex-1 bg-foreground focus:outline-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddFolder(); // Save the folder on Enter
                                            }
                                        }}
                                    />
                                    <button
                                        className="p-1 font-semibold text-gray-700 rounded hover:bg-gray-300"
                                        onClick={() => {
                                            setFolderName(''); // Clear input
                                            setIsEditing(false); // Exit edit mode
                                        }}
                                    >
                                        <FaX></FaX>
                                    </button>
                                </div>

                            ) : (
                                <button
                                    className="w-full p-2 text-sm text-gray-700 transition-opacity duration-200 border-2 rounded hover:opacity-70"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Add New Folder
                                </button>
                            )}
                        </div>
                    </div>

                )}

                <div
                    className={`${showOverlay ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
                    {/* Logo */}
                    <div className="text-3xl font-bold text-[#F99B26] mb-8 pt-4">~ ZEAL.</div>

                    <div
                        className="h-34 bg-gradient-to-br from-[#F99B26] to-[#943500] text-white p-4 rounded-lg mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-lg font-semibold">{sessionData?.fullName}</p>
                            <button
                                className="bg-[#F99B26] px-3 py-1 text-sm rounded-md">Badge
                            </button>
                        </div>
                        <p className="font-bold">Student</p>
                        <p className="text-sm">{sessionData?.email}</p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-4">
                        <NavItem href="/" icon={<FaHome />} label="Dashboard"
                            onClick={handleNavClick} />
                        <NavItem href="/courses" icon={<FaBook />} label="Courses"
                            onClick={handleNavClick} />
                        <NavItem href="/notes" icon={<FaStickyNote />} label="Notes"
                            onClick={handleNavClick} />
                        <NavItem href="/forum" icon={<FaUsers />} label="Forum"
                            onClick={handleNavClick} />
                        <NavItem href="/schedule" icon={<FaCalendar />} label="Schedule"
                            onClick={handleNavClick} />
                        <NavItem href="/contact" icon={<FaAddressBook />} label="Contact"
                            onClick={handleNavClick} />
                    </nav>
                </div>

                <div
                    className={`space-y-4 ${showOverlay ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
                    <NavItem href="/settings" icon={<IoSettingsSharp />}
                        label="Settings" onClick={handleNavClick} />
                    <NavItem href="" icon={<IoLogOut />} label="Logout"
                        onClick={handleNavClick} />
                </div>

                <LogoutConfirmationDialog open={openLogoutDialog} onCancel={handleCancelLogout} onConfirm={handleConfirmLogout} />
            </div>
        </aside>
    </div>);
}

function NavItem({ href, icon, label, onClick }) {
    const isLogout = label === "Logout";

    return (<div onClick={() => onClick(href)} className="w-full">
        <Link
            href={href}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isLogout ? 'text-red-500 hover:bg-red-100' : 'text-gray-700 hover:bg-gray-200'}`}
        >
            <span className="text-xl">{icon}</span>
            <span className={`font-medium ${isLogout ? 'text-red-500' : ''}`}>{label}</span>
        </Link>
    </div>);
}