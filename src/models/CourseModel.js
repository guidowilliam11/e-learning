import mongoose, {Types} from 'mongoose'
import Subscriber from './SubscriberModel'
import Session from './SessionModel'

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide the course title.'],
            minlength: [3, 'Course title must be at least 3 characters long.'],
            maxlength: [100, 'Course title cannot exceed 100 characters.'],
        },
        description: {
            type: String,
            required: [true, 'Please provide the course description.'],
            minlength: [10, 'Course description must be at least 10 characters long.'],
            maxlength: [500, 'Course description cannot exceed 500 characters.'],
        },
        subscribers: [
            {
                type: Types.ObjectId,
                ref: Subscriber.modelName,
            },
        ],
        sessions: [
            {
                type: Types.ObjectId,
                ref: Session.modelName,
            },
        ],
    },
    {timestamps: true, versionKey: false}
)

const Course =
    mongoose.models.courses || mongoose.model('courses', courseSchema)

export default Course
