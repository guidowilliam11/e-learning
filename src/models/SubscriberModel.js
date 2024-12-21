import mongoose, { Schema, Types } from 'mongoose'
import Students from './StudentModel'

const subscriberSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      required: true,
      ref: Students.modelName,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Subscriber =
  mongoose.models.subscribers || mongoose.model('subscribers', subscriberSchema)

export default Subscriber
