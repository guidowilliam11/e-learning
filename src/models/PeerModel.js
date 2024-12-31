"use server"

import mongoose, { Types } from 'mongoose'
import Messages from './MessageModel'

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
      ref: Messages.modelName,
      default: null
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
