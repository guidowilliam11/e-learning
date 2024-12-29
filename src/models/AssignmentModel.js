import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title.'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description.'],
    },
    list: {
      type: [String],
      default: ['This is an empty list.'],
    },
  },
  { timestamps: true, versionKey: false }
)

const Assignment =
  mongoose.models.assignments || mongoose.model('assignments', assignmentSchema)

export default Assignment
