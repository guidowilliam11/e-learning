import Note from '../../../../../models/NotesModel';
import Student from '../../../../../models/StudentModel';
import { connectToDatabase } from '@/libs/mongo/config';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET: Check if the user is authorized to edit a note
export async function GET(req, { params }) {
    const noteId = (await params).id
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = session.user.id;

        if (!noteId) {
            return NextResponse.json({ message: 'Note ID is required' }, { status: 400 });
        }

        const note = await Note.findById(noteId);
        if (!note) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        const isAuthorized = note.creatorId == userId || note.collaborators.includes(userId);

        if (!isAuthorized) {
            return NextResponse.json({ message: 'User is not authorized to edit this note ' + student._id + ' ' + note.creatorId}, { status: 403 });
        }

        return NextResponse.json({ message: 'User is authorized', note }, { status: 200 });
    } catch (error) {
        console.error('Error checking authorization:', error);
        return NextResponse.json({ message: 'Error checking authorization' , noteId }, { status: 500 });
    }
}