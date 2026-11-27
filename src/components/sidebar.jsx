"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    LuLayoutDashboard,
    LuGraduationCap,
    LuBookOpen,
    LuCalendarDays,
    LuMessagesSquare,
    LuMessageCircle,
    LuSettings,
    LuLogOut,
    LuChevronDown,
    LuChevronRight,
    LuChevronLeft,
    LuPlus,
    LuX,
    LuFileText,
    LuPanelLeftClose,
    LuPanelLeftOpen,
} from 'react-icons/lu';
import LogoutConfirmationDialog from '@/app/(auth)/logout/component/LogoutConfirmationDialog';
import { redirect, usePathname } from 'next/navigation';
import { toast } from "react-toastify";
import { fetchFocusedHours } from '@/app/(home)/action';
import { useNotesContext } from '@/contexts/notesContext';
import { useSession } from 'next-auth/react';

// Dummy notes data for users

export default function Sidebar() {
    const pathname = usePathname()

    const { notesData, setNotesData } = useNotesContext()

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [expandedTopics, setExpandedTopics] = useState({});
    const [selectedSession, setSelectedSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hoveredFolder, setHoveredFolder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [reload, setReload] = useState(false);
    const [noteInputVisible, setNoteInputVisible] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [sessionData, setSessionData] = useState({});
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [badge, setBadge] = useState('Intermediate')

    const fetchFocusedHoursData = async () => {
        try {
            const data = await fetchFocusedHours()
            if (data.averageHoursSpent >= 0 && data.averageHoursSpent <= 15) {
                setBadge('Intermediate')
            } else if (data.averageHoursSpent > 15 && data.averageHoursSpent <= 35) {
                setBadge('Pro')
            } else if (data.averageHoursSpent > 35) {
                setBadge('Scholarly')
            }
        } catch (error) {
            console.error(error)
        }
    }

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
        fetchFocusedHoursData()
    }, [])

    // The profile comes from the session itself; it used to wait for the dashboard to copy it into localStorage.
    const { data: session } = useSession();
    useEffect(() => {
        if (session?.user) setSessionData(session.user);
    }, [session]);

    // Fetch notes data
    useEffect(() => {

        if (pathname.includes('/notes')) {
            setShowOverlay(true);
        }
        const fetchNotes = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/folder');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setNotesData(data);
                setLoading(false)
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            }
        };

        fetchNotes();
    }, [reload]);

    // Toggle overlay when navigating to notes
    const handleNavClick = (path) => {
        if (path.includes('/notes')) {
            setShowOverlay(true);

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

    const initials = (sessionData?.fullName || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    const levelTone = badge === 'Scholarly' ? 'bg-ink text-white' : badge === 'Pro' ? 'bg-accent-wash text-accent' : 'bg-focus-wash text-focus-ink'

    if (isSidebarCollapsed) {
        return (
            <aside className="flex flex-col items-center w-16 h-screen gap-2 py-4 bg-white border-r border-line shrink-0">
                <button onClick={toggleSidebar} aria-label="Expand sidebar" className="grid mb-4 rounded-md size-9 place-items-center text-ink-2 hover:bg-page">
                    <LuPanelLeftOpen size={18} />
                </button>
                {NAV.map((item) => (
                    <Link key={item.href} href={item.href} aria-label={item.label} title={item.label}
                        className={`grid size-10 place-items-center rounded-md ${isActive(pathname, item.href) ? 'bg-accent-wash text-accent' : 'text-ink-2 hover:bg-page'}`}>
                        <item.icon size={19} />
                    </Link>
                ))}
            </aside>
        )
    }

    return (
        <aside className="relative flex flex-col h-screen bg-white border-r w-64 shrink-0 border-line">
            <div className="flex items-center justify-between px-5 h-16">
                <Link href="/" className="text-xl font-bold tracking-tight text-ink">zeal<span className="text-focus">.</span></Link>
                <button onClick={toggleSidebar} aria-label="Collapse sidebar" className="grid rounded-md size-8 place-items-center text-ink-3 hover:bg-page hover:text-ink">
                    <LuPanelLeftClose size={17} />
                </button>
            </div>

            {showOverlay ? (
                <div className="flex flex-col flex-1 min-h-0 px-3">
                    <button onClick={() => setShowOverlay(false)} className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-ink-2 hover:text-ink">
                        <LuChevronLeft size={16} /> Back to menu
                    </button>
                    <p className="px-2 pt-3 pb-2 text-xs font-medium tracking-wide uppercase text-ink-3">Notes</p>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        {loading ? (
                            <p className="px-2 text-sm text-ink-3">Loading…</p>
                        ) : (notesData.notes.map((folder) => (
                            <div key={folder._id} className="mb-1"
                                onMouseEnter={() => setHoveredFolder(folder._id)}
                                onMouseLeave={() => setHoveredFolder(null)}>
                                <div className="flex items-center justify-between px-2 py-1.5 text-sm rounded-md cursor-pointer text-ink hover:bg-page" onClick={() => toggleTopic(folder._id)}>
                                    <span className="flex items-center gap-1.5 font-medium truncate">
                                        {expandedTopics[folder._id] ? <LuChevronDown size={14} /> : <LuChevronRight size={14} />}
                                        {folder.name}
                                    </span>
                                    <button aria-label={`New note in ${folder.name}`}
                                        className={`grid size-6 place-items-center rounded text-ink-3 hover:bg-white hover:text-ink ${hoveredFolder === folder._id ? 'opacity-100' : 'opacity-0'} focus:opacity-100`}
                                        onClick={(e) => { e.stopPropagation(); handleAddNote(folder._id) }}>
                                        <LuPlus size={14} />
                                    </button>
                                </div>
                                {expandedTopics[folder._id] && (
                                    <ul className="ml-5 list-none border-l border-line">
                                        {folder.notes.map((note) => (
                                            <li key={note._id}>
                                                <Link href={'/notes/' + note._id} onClick={() => setSelectedSession(note._id)}
                                                    className={`flex items-center gap-2 py-1.5 pl-3 pr-2 text-sm truncate ${pathname === '/notes/' + note._id ? 'text-accent font-medium' : 'text-ink-2 hover:text-ink'}`}>
                                                    <LuFileText size={14} className="shrink-0" />{note.topic}
                                                </Link>
                                            </li>
                                        ))}
                                        {noteInputVisible === folder._id && (
                                            <li className="flex items-center gap-1 py-1 pl-3">
                                                <input autoFocus type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Note title" aria-label="New note title"
                                                    className="flex-1 min-w-0 px-2 py-1 text-sm border rounded border-line focus:outline-none focus:border-accent"
                                                    onKeyDown={(e) => { if (e.key === 'Enter') saveNote(folder._id) }} />
                                                <button aria-label="Cancel" className="grid rounded size-6 place-items-center text-ink-3 hover:bg-page" onClick={() => setNoteInputVisible(null)}><LuX size={14} /></button>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        )))}
                    </div>
                    <div className="py-3">
                        {isEditing ? (
                            <div className="flex items-center gap-1">
                                <input autoFocus type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)}
                                    placeholder="Folder name" aria-label="Folder name"
                                    className="flex-1 min-w-0 px-2 py-1.5 text-sm border rounded-md border-line focus:outline-none focus:border-accent"
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddFolder() }} />
                                <button aria-label="Cancel" className="grid rounded-md size-8 place-items-center text-ink-3 hover:bg-page" onClick={() => { setFolderName(''); setIsEditing(false) }}><LuX size={15} /></button>
                            </div>
                        ) : (
                            <button className="flex items-center justify-center w-full gap-1.5 py-2 text-sm font-medium border rounded-md border-line text-ink-2 hover:bg-page" onClick={() => setIsEditing(true)}>
                                <LuPlus size={15} /> New folder
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <nav className="flex-1 px-3 pt-2 space-y-6">
                    {SECTIONS.map((section) => (
                        <div key={section.title}>
                            <p className="px-2 pb-1.5 text-xs font-medium tracking-wide uppercase text-ink-3">{section.title}</p>
                            {section.items.map((item) => (
                                <NavItem key={item.href} {...item} active={isActive(pathname, item.href)} onClick={handleNavClick} />
                            ))}
                        </div>
                    ))}
                </nav>
            )}

            <div className="p-3 border-t border-line">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="grid text-sm font-semibold text-white rounded-full size-9 place-items-center bg-ink shrink-0" aria-hidden>{initials}</div>
                    <div className="flex-1 min-w-0" title={sessionData?.email}>
                        <p className="text-sm font-medium truncate text-ink">{sessionData?.fullName}</p>
                        <span className={`inline-block mt-0.5 px-1.5 py-px text-[11px] font-semibold rounded ${levelTone}`} title="Level from your average focused hours">{badge}</span>
                    </div>
                </div>
                <NavItem href="/settings" icon={LuSettings} label="Settings" active={pathname.startsWith('/settings')} onClick={handleNavClick} />
                <button onClick={() => setOpenLogoutDialog(true)} className="flex items-center w-full gap-3 px-2 py-2 text-sm font-medium rounded-md text-ink-2 hover:bg-red-50 hover:text-red-700">
                    <LuLogOut size={18} /> Log out
                </button>
            </div>

            <LogoutConfirmationDialog open={openLogoutDialog} onCancel={handleCancelLogout} onConfirm={handleConfirmLogout} />
        </aside>
    );
}

const SECTIONS = [
    { title: 'Learn', items: [
        { href: '/', icon: LuLayoutDashboard, label: 'Dashboard' },
        { href: '/courses', icon: LuGraduationCap, label: 'My learning' },
        { href: '/notes', icon: LuBookOpen, label: 'Notes' },
        { href: '/schedule', icon: LuCalendarDays, label: 'Schedule' },
    ] },
    { title: 'Community', items: [
        { href: '/forum', icon: LuMessagesSquare, label: 'Forum' },
        { href: '/contact', icon: LuMessageCircle, label: 'Messages' },
    ] },
]
const NAV = SECTIONS.flatMap((s) => s.items)

function isActive(pathname, href) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

function NavItem({ href, icon: Icon, label, active, onClick }) {
    return (
        <Link href={href} onClick={() => onClick(href)} aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-accent-wash text-accent' : 'text-ink-2 hover:bg-page hover:text-ink'}`}>
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );
}
