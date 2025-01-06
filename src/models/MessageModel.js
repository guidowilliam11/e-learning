import mongoose, { Types } from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      $type: Types.ObjectId,
      refPath: 'conversationType',
      required: true
    },
    conversationType: {
      $type: String,
      required: true,
      enum: ['peers', 'communities']
    },
    text: {
      $type: String,
      default: ''
    },
    fileName: {
      $type: String,
      default: ''
    },
    file: {
      $type: String,
      default: ''
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
