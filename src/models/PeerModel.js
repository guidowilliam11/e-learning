import mongoose, {Types} from 'mongoose'

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
      ref: 'messages'
    },
    unreadCount: {
      type: Number,
      default: 0
    },
    isCallOngoing: {
      type: Boolean,
      default: false
    },
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
