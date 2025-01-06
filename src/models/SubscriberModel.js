import mongoose, {Schema, Types} from 'mongoose'
import Students from './StudentModel'
import Session from "@/models/SessionModel";

const subscriberSchema = new Schema(
    {
        studentId: {
            type: Types.ObjectId,
            required: true,
            ref: Students.modelName,
        },
        progress: [
            {
                type: Types.ObjectId,
                ref: Session.modelName,
            },
        ],
    },
    {timestamps: true, versionKey: false}
)

const Subscriber =
    mongoose.models.subscribers || mongoose.model('subscribers', subscriberSchema)

export default Subscriber
