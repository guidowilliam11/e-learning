import mongoose, {Types} from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      $type: Types.ObjectId,
      ref: 'chats',
      required: true
    },
    type: {
      $type: String,
      required: true
    },
    value: {
      $type: String,
      required: true
    },
    sender: {
      $type: Types.ObjectId,
      ref: 'students'
    }
  },
  {
    timestamps: true,
    typeKey: '$type',
    toObject: {
      virtuals: true
    }
  }
)

const Messages =
  mongoose.models.messages || mongoose.model('peers', messageSchema)

export default Messages
