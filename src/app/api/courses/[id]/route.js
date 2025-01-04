import { connectToDatabase } from "@/libs/mongo/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Course from "@/models/CourseModel";
import { NextResponse } from "next/server";

// GET: Check if the user is authorized to view the course
export async function GET(req, { params }) {
    const courseId = params.id; // Direct access to params.id

    try {
        // Connect to the database
        await connectToDatabase();

        // Check session for authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Get the authenticated user's ID
        const userId = session.user.id;

        // Fetch the course with populated fields
        const course = await Course.findById(courseId).populate([
            { path: 'sessions' },
            { path: 'subscribers' }
        ]);

        // Handle course not found
        if (!course) {
            return NextResponse.json(
                { message: 'Course not found' },
                { status: 404 }
            );
        }

        // Return the course data
        return NextResponse.json({ course }, { status: 200 });
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json(
            { message: 'Error fetching course' },
            { status: 500 }
        );
    }
}
