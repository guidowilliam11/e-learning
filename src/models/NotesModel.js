import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema({
    topic: {
        type: String,
        required: [true, 'Please provide a topic'],
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the creator ID'],
        ref: 'User',
    },
    collaborators: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    ],
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model('Note', noteSchema);
