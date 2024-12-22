import mongoose, { Types } from 'mongoose'
import Students from './StudentModel'
import Course from './CourseModel'

const scheduleSchema = new mongoose.Schema(
  {
    studentId: {
      type: Types.ObjectId,
      required: true,
      ref: Students.modelName,
    },
    courseId: {
      type: Types.ObjectId,
      required: true,
      ref: Course.modelName,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title.'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description.'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date.'],
    },
  },
  { timestamps: true }
)

const SubTopic =
  mongoose.models.schedules || mongoose.model('schedules', scheduleSchema)

export default SubTopic
