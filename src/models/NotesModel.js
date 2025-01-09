import mongoose, {Schema, Types} from 'mongoose';

const noteSchema = new Schema({
    topic: {
        type: String,
        required: [true, 'Please provide a topic'],
    },
    creatorId: {
        type: Types.ObjectId,
        required: [true, 'Please provide the creator ID'],
        ref: 'students',
    },
    collaborators: [
        {
            type: Types.ObjectId,
            ref: 'students',
        },
    ],
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model('Note', noteSchema);
