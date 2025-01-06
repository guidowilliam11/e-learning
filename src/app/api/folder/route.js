import mongoose from 'mongoose';
import Folder from '../../../models/FolderModel';
import Notes from '../../../models/NotesModel';
import { connectToDatabase } from '@/libs/mongo/config';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {getServerSession} from "next-auth";
import res from "express/lib/response";
import {NextResponse} from "next/server";

// GET: Fetch all folders and notes for the logged-in user
export async function GET(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return res.status(401).json({ message: 'Unauthorized' });

        const userId = session.user.id;
        const folders = await Folder.find({ ownerId: userId }).populate('notes');
        return NextResponse.json(
            { notes: folders },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'User already exists' },
            { status: 400 }
        )    }
}

// POST: Create a new folder
export async function POST(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return res.status(401).json({ message: 'Unauthorized' });

        const userId = session.user.id;
        const { folderName } = await req.json();

        if (!folderName) {
            return NextResponse.json(
                { message: 'Folder name is required' },
                { status: 400 }
            );
        }

        const newFolder = await Folder.create({ ownerId: userId, name: folderName, notes: []});
        return NextResponse.json(
            { folder: newFolder },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Error creating folder' },
            { status: 500 }
        );
    }
}
