"use server"

import mongoose, { Types } from 'mongoose'
import Messages from './MessageModel'
import Students from './StudentModel'

const communitySchema = new mongoose.Schema(
  {
    participants: [
      {
        type: Types.ObjectId,
        ref: Students.modelName
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
        ref: Students.modelName
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
