import mongoose, { Types } from 'mongoose'

const subTopicSchema = new mongoose.Schema(
  {
    roomId: {
      type: Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a subtopic'],
    },
  },
  { timestamps: true }
)

const SubTopic =
  mongoose.models.subTopics || mongoose.model('subTopics', subTopicSchema)

export default SubTopic
