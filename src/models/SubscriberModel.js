import mongoose, {Schema, Types} from 'mongoose'
import Students from './StudentModel'

const subscriberSchema = new Schema(
    {
        studentId: {
            type: Types.ObjectId,
            required: true,
            ref: Students.modelName, // Ensure Students.modelName is correctly defined
        },
        progress: {
            type: Number,
            default: 0,
            min: [0, 'Progress cannot be less than 0'],
            max: [100, 'Progress cannot be greater than 100'],
        },
    },
    {timestamps: true, versionKey: false}
)

const Subscriber =
    mongoose.models.subscribers || mongoose.model('subscribers', subscriberSchema)

export default Subscriber
