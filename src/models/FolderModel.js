import mongoose, { Schema } from 'mongoose';

const folderSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a folder name'],
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the folder owner'],
        ref: 'User',
    },
    notes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Note',
        },
    ],
}, { timestamps: true });

export default mongoose.models.Folder || mongoose.model('Folder', folderSchema);
