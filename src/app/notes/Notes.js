"use client";

import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { orange } from "@mui/material/colors";
import Tag from "@/components/Tag";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {toast} from "react-toastify";

const ITEM_HEIGHT = 48;

const App = ({ user }) => {
    const [notesData, setNotesData] = useState([]);
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

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const fetchNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/folder");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNotesData(data);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
            setError("Failed to fetch notes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleDeleteNote = async (noteId) => {
        const confirmDelete = confirm("Are you sure you want to delete this note?");
        if (!confirmDelete) return;

        try {
            const response = await fetch("/api/folder/notes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ noteId }),
            });

            if (!response.ok) throw new Error("Failed to delete note");
            toast.success("Note deleted successfully")
            fetchNotes();
        } catch (error) {
            toast.error("Error deleting note")
        }
    };

    const handleEditNote = async (noteId) => {
        try {
            const response = await fetch("/api/folder/notes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ noteId, updatedTopic: newTopic }),
            });

            if (!response.ok) throw new Error("Failed to update note");
            toast.success("Note updated successfully")
            setEditModalOpen(false);
            setSelectedNote(null);
            fetchNotes();
        } catch (error) {
            alert("Error updating note");
            toast.error("Error updating note")

        }
    };

    const handleDeleteFolder = async (folderId) => {
        const confirmDelete = confirm("Are you sure you want to delete this folder and its notes?");
        if (!confirmDelete) return;

        try {
            const response = await fetch("/api/folder", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folderId }),
            });

            if (!response.ok) throw new Error("Failed to delete folder");
            toast.success("Folder deleted successfully")
            fetchNotes();
        } catch (error) {
            toast.error("Error deleting folder")

        }
    };

    const handleEditFolder = async (folderId) => {
        try {
            const response = await fetch("/api/folder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folderId, updatedName: newFolderName }),
            });

            if (!response.ok) throw new Error("Failed to update folder");
            alert("Folder updated successfully");
            toast.success("Folder updated successfully")
            setEditFolderModalOpen(false);
            setSelectedFolder(null);
            fetchNotes();
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
        return <div>Loading notes...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="w-full">
            <h1 className="mb-4 text-xl font-semibold">Notes by Folder</h1>
            {notesData.length === 0 ? (
                <div>No notes available.</div>
            ) : (
                notesData.notes.map((folder) => (
                    <div key={folder._id} className="w-full mb-4">
                        <div className="flex items-center mb-4 group">
                            <h2 className="text-lg">{folder.name}&#39;s Folder</h2>
                            <IconButton
                                aria-label="more"
                                onClick={(event) => handleFolderMenuClick(event, folder)}
                                className="ml-4 transition-opacity duration-300 opacity-0 cursor-pointer group-hover:opacity-100"
                            >
                                <HiOutlineDotsVertical />
                            </IconButton>
                            <Menu
                                anchorEl={anchorElFolder}
                                open={Boolean(anchorElFolder)}
                                onClose={handleFolderMenuClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: "20ch",
                                    },
                                }}
                            >
                                <MenuItem onClick={openEditFolderModal}>Edit</MenuItem>
                                <MenuItem onClick={() => handleDeleteFolder(selectedFolder._id)}>Delete</MenuItem>
                            </Menu>
                        </div>
                        <div className="flex flex-col gap-2">
                            {folder.notes.map((note) => (
                                <div
                                    key={note._id}
                                    className="flex items-center justify-between flex-grow gap-4 p-4 overflow-hidden bg-white rounded-lg shadow-md"
                                >
                                    <div className="flex items-center w-[90%] justify-between">
                                        <div className="flex items-center w-4/12 gap-4">
                                            <div
                                                className="flex gap-4 items-center w-[60%] cursor-pointer"
                                                onClick={() => window.location.href = `/notes/${note._id}`}
                                            >
                                                <FaBook color={orange[500]} />
                                                <div>{note.topic}</div>
                                            </div>
                                            <div>
                                                {note.collaborators.length === 0 ? (
                                                    <Tag value="Private"
                                                        color="bg-red-500 px-1 py-[1px] text-xs font-light w-[95px] text-center" />
                                                ) : (
                                                    <Tag
                                                        value={`Shared ${note.collaborators.length > 5 ? '5+' : note.collaborators.length}`}
                                                        color="bg-blue-500 px-1 py-[1px] text-xs font-light w-[95px] text-center"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs ">created by:</div>
                                            <div>{note.creatorId.fullName}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs ">updated at:</div>
                                            <div>{formatDate(note.updatedAt)}</div>
                                        </div>
                                    </div>

                                    {/* Menu Component */}
                                    <IconButton
                                        aria-label="more"
                                        onClick={(event) => handleMenuClick(event, note)}
                                    >
                                        <HiOutlineDotsVertical />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{
                                            style: {
                                                maxHeight: ITEM_HEIGHT * 4.5,
                                                width: "20ch",
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={openEditModal}>Edit</MenuItem>
                                        <MenuItem onClick={() => handleDeleteNote(selectedNote._id)}>Delete</MenuItem>
                                    </Menu>
                                </div>
                            ))}
                        </div>
                    </div>
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
                            className="px-4 py-2 mr-2 text-white rounded-lg bg-primary"
                        >
                            Save
                        </button>
                        <button
                            onClick={closeEditModal}
                            className="px-4 py-2 text-black bg-gray-300 rounded-lg"
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
                            className="px-4 py-2 mr-2 text-white rounded-lg bg-primary"
                        >
                            Save
                        </button>
                        <button
                            onClick={closeEditFolderModal}
                            className="px-4 py-2 text-black bg-gray-300 rounded-lg"
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
