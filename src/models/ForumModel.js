import mongoose, { Types } from 'mongoose'
import Tag from './TagModel'
import Comment from './CommentModel'

const forumSchema = new mongoose.Schema(
  {
    publisher: {
      type: String,
      required: [true, 'Please provide a publisher'],
    },
    publishDate: {
      type: Date,
      required: [true, 'Please provide a date'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the content'],
    },
    tags: [
      {
        type: Types.ObjectId,
        ref: Tag.modelName,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Types.ObjectId,
        ref: Comment.modelName,
      },
    ],
  },
  { timestamps: true }
)

const Forum = mongoose.models.forums || mongoose.model('forums', forumSchema)

export default Forum
