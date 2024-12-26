import mongoose, { Types } from 'mongoose'
import Subscriber from './SubscriberModel'
import Session from './SessionModel'

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the course title.'],
    },
    description: {
      type: String,
      required: [true, 'Please provide the course description'],
    },
    subscribers: [
      {
        type: Types.ObjectId,
        ref: Subscriber.modelName,
      },
    ],
    sessions: [
      {
        type: Types.ObjectId,
        ref: Session.modelName,
      },
    ],
  },
  { timestamps: true, versionKey: false }
)

const Course =
  mongoose.models.courses || mongoose.model('courses', courseSchema)

export default Course
