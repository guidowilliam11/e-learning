import mongoose, { Schema, Types } from 'mongoose'

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    replies: [
      {
        type: Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Comment =
  mongoose.models.comments || mongoose.model('comments', commentSchema)

export default Comment
