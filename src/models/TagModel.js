import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: [true, 'Please provide a tag'],
    },
  },
  { timestamps: true, versionKey: false }
)

const Tag = mongoose.models.tags || mongoose.model('tags', tagSchema)

export default Tag
