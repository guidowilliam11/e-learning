"use client";

import React, { useEffect, useState } from "react";
import { FaFolder, FaLock, FaUserGroup, FaRegFileLines } from "react-icons/fa6";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { toast } from "react-toastify";
import { deleteFolder, deleteNote, editFolder, editNote, fetchNotes } from "@/app/notes/action";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useNotesContext } from "@/contexts/notesContext";

const ITEM_HEIGHT = 48;

const App = ({ user }) => {
    const { notesData, setNotesData } = useNotesContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [newTopic, setNewTopic] = useState("");

    const [anchorElFolder, setAnchorElFolder] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [isEditFolderModalOpen, setEditFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    const [deleteNoteModal, setDeleteNoteModal] = useState(false);
    const [deleteFolderModal, setDeleteFolderModal] = useState(false);


    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    useEffect(() => {
        showNotes();
    }, []);

    const showNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchNotes()
            if (!response) {
                throw Error(response);
            }
            setNotesData(response);
        } catch (error) {
            setError("Failed to fetch notes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const response = await deleteNote(noteId);
            if (!response) {
                toast.error("Failed to delete note.");
            }
            toast.success("Note deleted successfully")
            showNotes();
        } catch (error) {
            toast.error("Error deleting note")
        }
        setDeleteNoteModal(false);
        setEditModalOpen(false);
    };

    const hanldeDeleteNoteModal = (noteId) => {
        setSelectedNote(noteId);
        setDeleteNoteModal(true);
    };

    const handleEditNote = async (noteId) => {
        try {
            const response = await editNote(noteId, newTopic);
            if (!response) throw new Error("Failed to update note");
            toast.success("Note updated successfully")
            setEditModalOpen(false);
            setSelectedNote(null);
            showNotes();
        } catch (error) {
            toast.error("Error updating note")

        }
    };

    const handleDeleteFolder = async (folderId) => {
        try {
            const response = await deleteFolder(folderId);
            if (!response) throw new Error("Failed to delete folder");
            toast.success("Folder deleted successfully")
            setEditFolderModalOpen(false);
            setSelectedFolder(null);
            showNotes();
        } catch (error) {
            toast.error("Error deleting folder")
        }
        setDeleteFolderModal(false);
    };

    const hanldeDeleteFolderModal = (folderId) => {
        setSelectedFolder(folderId);
        setDeleteFolderModal(true);
    };

    const handleEditFolder = async (folderId) => {
        try {
            const response = await editFolder(folderId, newFolderName);

            if (!response) throw new Error("Failed to update folder");
            toast.success("Folder updated successfully")
            setEditFolderModalOpen(false);
            setSelectedFolder(null);
            showNotes();
        } catch (error) {
            toast.error("Error updating folder")
        }
    };

    const handleFolderMenuClick = (event, folder) => {
        setAnchorElFolder(event.currentTarget);
        setSelectedFolder(folder);
    };

    const handleFolderMenuClose = () => {
        setAnchorElFolder(null);
    };

    const openEditFolderModal = () => {
        setNewFolderName(selectedFolder.name);
        setEditFolderModalOpen(true);
        handleFolderMenuClose();
    };

    const closeEditFolderModal = () => {
        setEditFolderModalOpen(false);
        setNewFolderName("");
    };

    const handleEditFolderSubmit = () => {
        if (selectedFolder) {
            handleEditFolder(selectedFolder._id);
        }
    };

    const handleMenuClick = (event, note) => {
        setAnchorEl(event.currentTarget);
        setSelectedNote(note);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const openEditModal = () => {
        setNewTopic(selectedNote.topic);
        setEditModalOpen(true);
        handleMenuClose();
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setNewTopic("");
    };

    const handleEditSubmit = () => {
        console.log(selectedNote)
        if (selectedNote) {
            handleEditNote(selectedNote._id);
        }
    };

    if (loading) {
        return <div className="max-w-[1200px] h-64 bg-white border rounded-card border-line animate-pulse" />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-[1200px]">
            <DeleteConfirmationDialog
                open={deleteNoteModal}
                onCancel={() => setDeleteNoteModal(false)}
                onConfirm={() => handleDeleteNote(selectedNote)}
                message='note'
            />

            <DeleteConfirmationDialog
                open={deleteFolderModal}
                onCancel={() => setDeleteFolderModal(false)}
                onConfirm={() => handleDeleteFolder(selectedFolder)}
                message='folder'
            />
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Notes</h2>
                    <p className="mt-1 text-sm text-ink-2">
                        {(notesData.notes || []).reduce((a, f) => a + f.notes.length, 0)} notes in {(notesData.notes || []).length} folders. Shared notes are edited live with your peers.
                    </p>
                </div>
            </div>
            {!notesData.notes?.length ? (
                <p className="py-16 text-sm text-center text-ink-2">No notes yet. Create a folder from the sidebar.</p>
            ) : (
                notesData.notes.map((folder) => (
                    <section key={folder._id} className="mt-8">
                        <div className="flex items-center gap-2 mb-3 group">
                            <FaFolder className="text-ink-3" aria-hidden />
                            <h3 className="font-semibold">{folder.name}</h3>
                            <span className="text-sm text-ink-3 tnum">{folder.notes.length}</span>
                            <IconButton
                                aria-label={`${folder.name} folder options`}
                                size="small"
                                onClick={(event) => handleFolderMenuClick(event, folder)}
                                className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                                <HiOutlineDotsVertical size={16} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorElFolder}
                                open={Boolean(anchorElFolder)}
                                onClose={handleFolderMenuClose}
                                PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: "20ch" } }}
                            >
                                <MenuItem onClick={openEditFolderModal}>Rename</MenuItem>
                                <MenuItem onClick={() => hanldeDeleteFolderModal(selectedFolder._id)}>Delete</MenuItem>
                            </Menu>
                        </div>
                        <div className="overflow-hidden bg-white border rounded-card border-line">
                            <div className="grid grid-cols-[minmax(0,1fr)_160px_180px_140px_44px] gap-4 px-5 py-2.5 text-xs font-medium text-ink-3 border-b border-line bg-page/60">
                                <span>Title</span><span>Access</span><span>Created by</span><span>Updated</span><span />
                            </div>
                            {folder.notes.length === 0 && <p className="px-5 py-4 text-sm text-ink-3">Empty folder.</p>}
                            {folder.notes.map((note) => (
                                <div key={note._id} className="grid grid-cols-[minmax(0,1fr)_160px_180px_140px_44px] gap-4 items-center px-5 py-3 text-sm border-b last:border-b-0 border-line hover:bg-page/60">
                                    <a href={`/notes/${note._id}`} className="flex items-center min-w-0 gap-3 font-medium hover:text-accent">
                                        <FaRegFileLines className="shrink-0 text-ink-3" aria-hidden />
                                        <span className="truncate">{note.topic}</span>
                                    </a>
                                    <span>
                                        {note.collaborators.length === 0 ? (
                                            <span className="inline-flex items-center gap-1.5 text-ink-2"><FaLock size={11} aria-hidden /> Private</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded bg-accent-wash text-accent">
                                                <FaUserGroup size={11} aria-hidden /> Shared with {note.collaborators.length > 5 ? '5+' : note.collaborators.length}
                                            </span>
                                        )}
                                    </span>
                                    <span className="truncate text-ink-2">{note.creatorId.fullName}</span>
                                    <span className="text-ink-2 tnum">{formatDate(note.updatedAt)}</span>
                                    <IconButton aria-label={`${note.topic} options`} size="small" onClick={(event) => handleMenuClick(event, note)}>
                                        <HiOutlineDotsVertical size={16} />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: "20ch" } }}
                                    >
                                        <MenuItem onClick={openEditModal}>Rename</MenuItem>
                                        <MenuItem onClick={() => hanldeDeleteNoteModal(selectedNote._id)}>Delete</MenuItem>
                                    </Menu>
                                </div>
                            ))}
                        </div>
                    </section>
                ))
            )}

            {/* Edit Modal */}
            <Modal open={isEditModalOpen} onClose={closeEditModal}>
                <Box
                    className="p-4 bg-white rounded-lg"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                    }}
                >
                    <h2 className="mb-4 text-lg font-semibold">Edit Note</h2>
                    <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleEditSubmit}
                            className="h-9 px-4 mr-2 text-sm font-medium text-white rounded-md bg-accent hover:bg-accent-hover"
                        >
                            Save
                        </button>
                        <button
                            onClick={closeEditModal}
                            className="h-9 px-4 text-sm font-medium border rounded-md border-line hover:bg-page"
                        >
                            Cancel
                        </button>
                    </div>
                </Box>
            </Modal>

            {/* Edit Folder Modal */}
            <Modal open={isEditFolderModalOpen} onClose={closeEditFolderModal}>
                <Box
                    className="p-4 bg-white rounded-lg"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                    }}
                >
                    <h2 className="mb-4 text-lg font-semibold">Edit Folder</h2>
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleEditFolderSubmit}
                            className="h-9 px-4 mr-2 text-sm font-medium text-white rounded-md bg-accent hover:bg-accent-hover"
                        >
                            Save
                        </button>
                        <button
                            onClick={closeEditFolderModal}
                            className="h-9 px-4 text-sm font-medium border rounded-md border-line hover:bg-page"
                        >
                            Cancel
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default App;
