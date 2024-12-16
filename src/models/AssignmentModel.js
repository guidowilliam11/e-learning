import mongoose, { Types } from 'mongoose'
import Students from './StudentModel'
import Course from './CourseModel'

const assignmentSchema = new mongoose.Schema(
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
      required: [true, 'Please provide a subtopic'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a subtopic'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a subtopic'],
    },
    status: {
      type: String,
      required: [true, 'Please provide a subtopic'],
    },
  },
  { timestamps: true }
)

const SubTopic =
  mongoose.models.assignments || mongoose.model('assignments', assignmentSchema)

export default SubTopic
