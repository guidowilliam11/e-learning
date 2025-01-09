import mongoose from 'mongoose';
import Note from '../../../../models/NotesModel';
import Folder from '../../../../models/FolderModel'
import Student from '../../../../models/StudentModel'
import { connectToDatabase } from '@/libs/mongo/config';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import Notes from "@/models/NotesModel";

// POST: Create a new note
export async function POST(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = session.user.id;
        const { folderId, newNote } = await req.json();

        if (!newNote) {
            return NextResponse.json({ message: 'Topic is required' }, { status: 400 });
        }

        if (!folderId) {
            return NextResponse.json({ message: 'Folder ID is required' }, { status: 400 });
        }

        const addedNotes = await Note.create({
            topic: newNote,
            creatorId: userId,
            collaborators: [],
        });

        const folder = await Folder.findById(folderId);
        if (folder) {
            folder.notes.push(addedNotes._id);
            await folder.save();
        }

        return NextResponse.json({ note: newNote }, { status: 201 });
    } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json({ message: 'Error creating note' }, { status: 500 });
    }
}

// PATCH: Add collaborator to an existing note
export async function PATCH(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { noteId, email } = await req.json();

        const student = await Student.findOne({ email: email });
        if(!student){
            return NextResponse.json({message: 'Collaborator Not Found'}, {status: 400});
        }

        if (!noteId) {
            return NextResponse.json({ message: 'Note ID is required' }, { status: 400 });
        }

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const note = await Note.findById(noteId);
        if (!note) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        if (note.collaborators.includes(student._id)) {
            return NextResponse.json({ message: 'Collaborator already added' }, { status: 400 });
        }

        note.collaborators.push(student._id);
        await note.save();

        return NextResponse.json({ message: 'Collaborator added successfully', note }, { status: 200 });
    } catch (error) {
        console.error('Error adding collaborator:', error);
        return NextResponse.json({ message: 'Error adding collaborator' }, { status: 500 });
    }
}


// DELETE: Delete a specific note
export async function DELETE(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { noteId } = await req.json();

        if (!noteId) {
            return NextResponse.json({ message: 'Note ID is required' }, { status: 400 });
        }

        // Find and delete the note
        const deletedNote = await Notes.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        // Remove the note from its associated folder
        await Folder.updateMany(
            { notes: noteId },
            { $pull: { notes: noteId } }
        );

        return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error deleting note' }, { status: 500 });
    }
}

// PUT: Update a specific note
export async function PUT(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { noteId, updatedTopic } = await req.json();

        if (!noteId || !updatedTopic) {
            return NextResponse.json({ message: 'Note ID and updated topic are required' }, { status: 400 });
        }

        const updatedNote = await Notes.findByIdAndUpdate(
            noteId,
            { topic: updatedTopic },
            { new: true }
        );

        if (!updatedNote) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ note: updatedNote }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating note' }, { status: 500 });
    }
}





