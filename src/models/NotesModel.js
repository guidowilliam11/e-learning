import mongoose, { Types } from 'mongoose'
import SubTopic from './SubTopicModel'

const noteSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: [true, 'Please provide a topic'],
    },
    subTopics: [
      {
        type: Types.ObjectId,
        ref: SubTopic.modelName,
      },
    ],
    creatorId: {
      type: Types.ObjectId,
      required: [true, 'Please provide the Creator'],
    },
  },
  { timestamps: true, versionKey: false }
)

const Notes = mongoose.models.notes || mongoose.model('notes', noteSchema)

export default Notes
