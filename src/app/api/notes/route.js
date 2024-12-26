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
        console.log(folders)
        return NextResponse.json(
            { notes: folders },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'User already exists' },
            { status: 400 }
        )    }
};