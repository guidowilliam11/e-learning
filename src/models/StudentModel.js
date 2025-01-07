import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please provide a username'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
        },
        picture: {
            type: String,
            default: '',
        },
        preferences: {
            allowPeerInvite: {
                type: Boolean,
                default: true,
            },
        },
        logs: {
            type: [
                {
                    date: {
                        type: Date,
                        required: true,
                    },
                    focusedHours: {
                        type: Number,
                        default: 0,
                    },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toObject: {
            virtuals: true,
        },
    }
);

const Students =
    mongoose.models.students || mongoose.model('students', studentSchema);

export default Students;
