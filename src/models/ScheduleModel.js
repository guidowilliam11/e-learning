import mongoose, { Types } from 'mongoose'
import Students from './StudentModel'

const scheduleSchema = new mongoose.Schema(
  {
    studentId: {
      type: Types.ObjectId,
      required: true,
      ref: Students.modelName,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title.'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date.'],
    },
    assignmentId: {
      type: Types.ObjectId,
      ref: 'assignments',
    },
  },
  { timestamps: true }
)

const Schedule =
  mongoose.models.schedules || mongoose.model('schedules', scheduleSchema)

export default Schedule
