import {connectToDatabase} from "@/libs/mongo/config";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import res from "express/lib/response";
import Course from "@/models/CourseModel";
import {NextResponse} from "next/server";
import Subscriber from "@/models/SubscriberModel";

export async function GET() {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return res.status(401).json({ message: 'Unauthorized' });

        const userId = session.user.id;
        // const courseDatas = await Course.find({ subscribers: userId }).populate('subscribers');
        const courseDatas = await Course.find().populate([{path: 'subscribers'}]);
        return NextResponse.json(
            { courses: courseDatas },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'error' },
            { status: 400 }
        )    }
}

export async function POST(req) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { courseId, sessionId } = await req.json();
        const userId = session.user.id;

        if (!courseId || !sessionId) {
            return NextResponse.json(
                { message: 'Invalid data provided' },
                { status: 400 }
            );
        }

        // Find the course and populate subscribers
        const course = await Course.findById(courseId).populate('subscribers');
        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        let subscriber = course.subscribers.find(
            (sub) => sub.studentId.toString() === userId
        );

        if (!subscriber) {
            const newSubscriber = await Subscriber.create({
                studentId: userId,
                progress: [],
            });

            course.subscribers.push(newSubscriber);
            await course.save();

            subscriber = newSubscriber;
        }

        subscriber.progress.push(sessionId);

        await subscriber.save();

        return NextResponse.json(
            { message: 'Progress updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
            { message: 'Error updating progress', error},
            { status: 500 }
        );
    }
}