import mongoose from 'mongoose';
import Folder from '../../../models/FolderModel';
import Notes from '../../../models/NotesModel';
import { connectToDatabase } from '@/libs/mongo/config';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET: Fetch all folders and notes for the logged-in user
export async function GET(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = session.user.id;
        const folders = await Folder.find({ ownerId: userId })
            .populate({
                path: "notes", // Populate the notes field
                populate: {
                    path: "creatorId",
                    model: "students"
                },
            });

        return NextResponse.json({ notes: folders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch folders' }, { status: 400 });
    }
}

// POST: Create a new folder
export async function POST(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = session.user.id;
        const { folderName } = await req.json();

        if (!folderName) {
            return NextResponse.json({ message: 'Folder name is required' }, { status: 400 });
        }

        const newFolder = await Folder.create({ ownerId: userId, name: folderName, notes: [] });
        return NextResponse.json({ folder: newFolder }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating folder' }, { status: 500 });
    }
}

// PUT: Update folder name
export async function PUT(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = session.user.id;
        const { folderId, updatedName } = await req.json();

        if (!folderId || !updatedName) {
            return NextResponse.json({ message: 'Folder ID and updated name are required' }, { status: 400 });
        }

        const folder = await Folder.findOneAndUpdate(
            { _id: folderId, ownerId: userId },
            { name: updatedName },
            { new: true }
        );

        if (!folder) {
            return NextResponse.json({ message: 'Folder not found or not authorized' }, { status: 404 });
        }

        return NextResponse.json({ folder }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating folder' }, { status: 500 });
    }
}

// DELETE: Delete folder and associated notes
export async function DELETE(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = session.user.id;
        const { folderId } = await req.json();

        if (!folderId) {
            return NextResponse.json({ message: 'Folder ID is required' }, { status: 400 });
        }

        const folder = await Folder.findOne({ _id: folderId, ownerId: userId });
        if (!folder) {
            return NextResponse.json({ message: 'Folder not found or not authorized' }, { status: 404 });
        }

        // Delete all notes in the folder
        await Notes.deleteMany({ _id: { $in: folder.notes } });

        // Remove shared references to these notes
        // await SharedFolder.updateMany(
        //     { notes: { $in: folder.notes } },
        //     { $pull: { notes: { $in: folder.notes } } }
        // );

        // Delete the folder itself
        await Folder.deleteOne({ _id: folderId });

        return NextResponse.json({ message: 'Folder and associated notes deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error deleting folder' }, { status: 500 });
    }
}
