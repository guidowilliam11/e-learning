import mongoose from 'mongoose';
import Note from '../../../../models/NotesModel';
import Folder from '../../../../models/FolderModel'
import Student from '../../../../models/StudentModel'
import { connectToDatabase } from '@/libs/mongo/config';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

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

        const { noteId, collaboratorId } = await req.json();

        const student = await Student.findById(collaboratorId)
        if(!student){
            return NextResponse.json({message: 'Collaborator Not Found'}, {status: 400});
        }

        if (!noteId) {
            return NextResponse.json({ message: 'Note ID is required' }, { status: 400 });
        }

        if (!collaboratorId) {
            return NextResponse.json({ message: 'Collaborator ID is required' }, { status: 400 });
        }

        const note = await Note.findById(noteId);
        if (!note) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        if (note.collaborators.includes(collaboratorId)) {
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





