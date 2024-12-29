import mongoose, { Types } from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      $type: Types.ObjectId,
      refPath: 'type',
      required: true
    },
    type: {
      $type: String,
      required: true,
      enum: ['peers', 'communities']
    },
    value: {
      $type: String,
      required: true
    },
    sender: {
      $type: Types.ObjectId,
      ref: 'students'
    },
    seenBy: {
      $type: [
        {
          $type: Types.ObjectId,
          ref: 'students'
        }
      ],
      default: []
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
  mongoose.models.messages || mongoose.model('messages', messageSchema)

export default Messages
