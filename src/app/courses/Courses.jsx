"use client";

import CourseCard from "../../components/courseCard";
import { useEffect, useState } from "react";
import {fetchCourses} from "@/app/courses/action";

export default function Courses({ user }) {
    const [coursesData, setCoursesData] = useState([]);

    // Fetch courses data
    useEffect(() => {
        const showCourses = async () => {
            try {
                const response = await fetchCourses();
                if (!response) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setCoursesData(response.courses || []);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        showCourses();
    }, []);

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {coursesData.map((course) => (
                <CourseCard
                    key={course._id}
                    {...course}
                    currentUserId={user.id}
                />
            ))}
        </div>
    );
}
