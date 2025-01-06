import { connectToDatabase } from '@/libs/mongo/config'
import Students from '@/models/StudentModel'; // Import your Students model
import { getServerSession } from 'next-auth';
import {authOptions} from "@/app/api/auth/[...nextauth]/route"; // Import next-auth for session handling

export async function PUT(req) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Get the user session
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const userId = session.user.id;

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Find the student
        const student = await Students.findById(userId);
        if (!student) {
            return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404 });
        }

        // Ensure the logs field exists
        if (!student.logs) {
            student.logs = [];
        }

        // Check if a log exists for today
        const existingLog = student.logs.find(
            (log) => new Date(log.date).toISOString().split('T')[0] === today
        );

        if (existingLog) {
            // Increment focusedHours for today's log
            existingLog.focusedHours += 0.5;
        } else {
            // Add a new log with 0.5 hours
            student.logs.push({ date: today, focusedHours: 0.5 });
        }

        // Save the updated student document
        await student.save();

        return new Response(JSON.stringify({ message: 'Focused hours updated successfully', logs: student }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'An error occurred while updating focused hours' }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Get the user session
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const userId = session.user.id;

        // Find the student
        const student = await Students.findById(userId);
        if (!student) {
            return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404 });
        }

        // Get today's month and year
        const today = new Date();
        const currentMonth = today.getMonth(); // Month as 0-indexed (January = 0)
        const currentYear = today.getFullYear();

        // Filter logs for the current year
        const yearlyLogs = student.logs.filter(
            (log) => new Date(log.date).getFullYear() === currentYear
        );

        // Filter logs for the current month
        const monthlyLogs = yearlyLogs.filter(
            (log) => new Date(log.date).getMonth() === currentMonth
        );

        // Calculate total hours for the current month
        const monthlyFocusedHours = monthlyLogs.reduce(
            (total, log) => total + log.focusedHours,
            0
        );

        // Calculate total hours and average hours spent for the year
        const totalFocusedHours = yearlyLogs.reduce(
            (total, log) => total + log.focusedHours,
            0
        );

        const averageHoursSpent =
            yearlyLogs.length > 0 ? totalFocusedHours / yearlyLogs.length : 0;

        // Map logs for the year
        const focusedHours = yearlyLogs.map((log) => ({
            date: log.date,
            focusedHours: log.focusedHours,
        }));

        return new Response(
            JSON.stringify({
                focusedHours, // Logs for the year
                monthlyFocusedHours, // Total hours for the current month
                averageHoursSpent, // Average hours per day for the year
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'An error occurred while fetching data' }),
            { status: 500 }
        );
    }
}


