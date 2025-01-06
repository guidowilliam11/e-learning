import mongoose, { Schema, Types } from 'mongoose'
import Students from './StudentModel'

const commentSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: Students.modelName,
      required: [true, 'Please provide a Student ID'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    replies: [
      {
        type: Types.ObjectId,
        ref: 'comments',
        default: [],
      },
    ],
    likedBy: [
      {
        type: Types.ObjectId,
        ref: Students.modelName,
        default: [],
      },
    ],
  },
  { timestamps: true, versionKey: false }
)

const Comment =
  mongoose.models.comments || mongoose.model('comments', commentSchema)

export default Comment
