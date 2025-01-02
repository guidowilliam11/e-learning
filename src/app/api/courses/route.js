import {connectToDatabase} from "@/libs/mongo/config";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import res from "express/lib/response";
import Course from "@/models/CourseModel";
import {NextResponse} from "next/server";

export async function GET(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);
        if (!session) return res.status(401).json({ message: 'Unauthorized' });

        const userId = session.user.id;
        const courses = await Course.find();
        return NextResponse.json(
            { courses: courses },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'error' },
            { status: 400 }
        )    }
}