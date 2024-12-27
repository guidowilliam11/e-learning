import mongoose from 'mongoose'

const summarySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide the summary content.'],
    },
    type: {
      type: String,
      required: [true, 'Please provide the summary type.'],
    },
  },
  { timestamps: true, versionKey: false }
)

const Summary =
  mongoose.models.summaries || mongoose.model('summaries', summarySchema)

export default Summary
