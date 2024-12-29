import mongoose, { Types } from 'mongoose'

const peerSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: Types.ObjectId,
        ref: 'students'
      }
    ],
    lastMessage: {
      type: Types.ObjectId,
      ref: 'messages',
      default: null
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
    ]
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true
    }
  }
)

const Peers =
  mongoose.models.peers || mongoose.model('peers', peerSchema)

export default Peers
