import mongoose, { Types } from 'mongoose'

const communitySchema = new mongoose.Schema(
  {
    participants: [
      {
        type: Types.ObjectId,
        ref: 'students'
      }
    ],
    lastMessage: {
      type: Types.ObjectId,
      ref: 'messages'
    },
    unreadCount: {
      type: Number,
      default: 0
    },
    onCall: [
      {
        type: Types.ObjectId,
        ref: 'students'
      }
    ],
    name: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true
    }
  }
)

const Communities =
  mongoose.models.communities || mongoose.model('communities', communitySchema)

export default Communities
