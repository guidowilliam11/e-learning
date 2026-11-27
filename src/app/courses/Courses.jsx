"use client";

import CourseCard from "../../components/courseCard";
import { useEffect, useMemo, useState } from "react";
import { fetchCourses } from "@/app/courses/action";
import { LuSearch } from "react-icons/lu";

// Laid out like Udemy's "My learning": filter tabs with counts, a search box, a 4-column card grid.
const FILTERS = [
    { id: "all", label: "All courses" },
    { id: "progress", label: "In progress" },
    { id: "new", label: "Not started" },
    { id: "done", label: "Completed" },
];

export default function Courses({ user }) {
    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchCourses()
            .then((response) => setCoursesData(response?.courses || []))
            .catch((error) => console.error("Failed to fetch courses:", error))
            .finally(() => setLoading(false));
    }, []);

    const courses = useMemo(() => coursesData.map((course) => {
        const watched = course.subscribers?.find((s) => s.studentId === user.id)?.progress?.length || 0;
        const total = course.sessions?.length || 0;
        const pct = total ? Math.round((watched / total) * 100) : 0;
        const state = pct === 0 ? "new" : pct === 100 ? "done" : "progress";
        return { ...course, watched, total, pct, state };
    }), [coursesData, user.id]);

    const counts = FILTERS.reduce((acc, f) => ({ ...acc, [f.id]: f.id === "all" ? courses.length : courses.filter((c) => c.state === f.id).length }), {});
    const shown = courses.filter((c) => (filter === "all" || c.state === filter) && c.title.toLowerCase().includes(query.trim().toLowerCase()));

    return (
        <div className="mx-auto max-w-[1200px]">
            <h2 className="text-2xl font-semibold tracking-tight">My learning</h2>
            <p className="mt-1 text-sm text-ink-2">
                {counts.progress} in progress · {counts.done} completed · {courses.reduce((a, c) => a + c.watched, 0)} sessions watched
            </p>

            <div className="flex items-center justify-between gap-6 mt-6 border-b border-line">
                <div role="tablist" aria-label="Filter courses" className="flex gap-6">
                    {FILTERS.map((f) => (
                        <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
                            className={`-mb-px pb-3 text-sm font-medium border-b-2 transition-colors ${filter === f.id ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                            {f.label} <span className="ml-1 text-ink-3 tnum">{counts[f.id]}</span>
                        </button>
                    ))}
                </div>
                <label className="relative mb-3">
                    <span className="sr-only">Search your courses</span>
                    <LuSearch size={16} className="absolute -translate-y-1/2 left-3 top-1/2 text-ink-3" aria-hidden />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your courses"
                        className="h-9 w-64 rounded-md border border-line bg-white pl-9 pr-3 text-sm placeholder:text-ink-3 focus:border-accent focus:outline-none" />
                </label>
            </div>

            {loading ? (
                <div className="grid grid-cols-4 gap-6 mt-6">
                    {Array.from({ length: 4 }, (_, i) => <div key={i} className="rounded-card bg-white border border-line aspect-[4/5] animate-pulse" />)}
                </div>
            ) : shown.length === 0 ? (
                <p className="py-16 text-sm text-center text-ink-2">
                    {query ? `No courses match "${query}".` : "Nothing here yet."}
                </p>
            ) : (
                <div className="grid grid-cols-4 gap-6 mt-6">
                    {shown.map((course) => <CourseCard key={course._id} {...course} />)}
                </div>
            )}
        </div>
    );
}
