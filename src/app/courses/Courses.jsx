"use client";

import CourseCard from '../../components/courseCard';
import {useEffect, useState} from "react";

export default function Courses({user}) {
    const [coursesData, setCoursesData] = useState([]);

// Fetch notes data
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCoursesData(data.courses);
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            }
        };

        fetchCourses();
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