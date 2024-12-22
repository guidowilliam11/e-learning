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
      default: []
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Assignment =
  mongoose.models.assignments || mongoose.model('assignments', assignmentSchema)

export default Assignment
