import mongoose, {Schema, Types} from 'mongoose';

const folderSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a folder name'],
    },
    ownerId: {
        type: Types.ObjectId,
        required: [true, 'Please provide the folder owner'],
        ref: 'students',
    },
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note',
        },
    ],
}, { timestamps: true });

export default mongoose.models.Folder || mongoose.model('Folder', folderSchema);
