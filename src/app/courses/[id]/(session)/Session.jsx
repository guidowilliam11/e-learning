"use client";

import React, { useState, useEffect, useMemo } from "react";
import { LuPlay, LuCheck, LuListVideo, LuUsers } from "react-icons/lu";
import { toast } from "react-toastify";
import { addProgress, fetchSessions } from "@/app/courses/action";

// Laid out like Udemy's course player: the video and its tabs on the left, "Course content" on the right.
const youtubeId = (url = "") => url.split("v=")[1]?.split("&")[0] || url.split("/").pop();

const SessionCard = ({ user, courseId }) => {
    const [course, setCourse] = useState();
    const [progress, setProgress] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [tab, setTab] = useState("summaries");
    const [summaryId, setSummaryId] = useState(null);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        fetchSessions(courseId)
            .then((response) => {
                if (!response?.course) return;
                setCourse(response.course);
                const mine = response.course.subscribers.find((s) => s.studentId === user.id)?.progress || [];
                setProgress(mine);
                // Open where the student left off: the first session not watched yet.
                setCurrentId((id) => id ?? (response.course.sessions.find((s) => !mine.includes(s._id)) || response.course.sessions[0])?._id);
            })
            .catch((error) => console.error("Error fetching sessions:", error));
    }, [courseId, reload]);

    const sessions = course?.sessions || [];
    const index = sessions.findIndex((s) => s._id === currentId);
    const current = sessions[index];
    const summary = useMemo(() => current?.summaries?.find((s) => s._id === summaryId) || current?.summaries?.[0], [current, summaryId]);
    const pct = sessions.length ? Math.round((progress.length / sessions.length) * 100) : 0;

    const markWatched = async (sessionId) => {
        if (progress.includes(sessionId)) return;
        const response = await addProgress(courseId, sessionId);
        if (response instanceof Error) {
            toast.error("Couldn't save your progress");
        } else {
            setReload((r) => !r);
        }
    };

    const open = (sessionId) => {
        setCurrentId(sessionId);
        setPlaying(false);
        setSummaryId(null);
    };

    const play = () => {
        setPlaying(true);
        markWatched(current._id);
    };

    if (!current) {
        return <div className="mx-auto max-w-[1280px] grid grid-cols-[1fr_360px] gap-6"><div className="bg-white border aspect-video rounded-card border-line animate-pulse" /><div className="bg-white border rounded-card border-line animate-pulse" /></div>;
    }

    return (
        <div className="mx-auto max-w-[1280px] grid grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
            <div className="min-w-0">
                <div className="relative overflow-hidden bg-black rounded-card aspect-video">
                    {playing ? (
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${youtubeId(current.video)}?autoplay=1&rel=0`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={current.name}
                        />
                    ) : (
                        // A poster until play is pressed, so the page doesn't load a YouTube player per visit.
                        <button onClick={play} className="absolute inset-0 w-full h-full group" aria-label={`Play ${current.name}`}>
                            <img src={course.thumbnail} alt="" className="absolute inset-0 object-cover w-full h-full opacity-60" />
                            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <span className="absolute grid transition-transform bg-white rounded-full shadow-lg size-16 place-items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink group-hover:scale-105">
                                <LuPlay size={26} className="ml-1" />
                            </span>
                            <span className="absolute text-left text-white bottom-5 left-6">
                                <span className="block text-xs font-medium tracking-wide uppercase text-white/70">Session {index + 1} of {sessions.length}</span>
                                <span className="block mt-1 text-xl font-semibold">{current.name}</span>
                            </span>
                        </button>
                    )}
                </div>

                <div role="tablist" aria-label="Session details" className="flex gap-6 mt-6 border-b border-line">
                    {[["summaries", "Summaries"], ["overview", "Overview"]].map(([id, label]) => (
                        <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                            className={`-mb-px pb-3 text-sm font-medium border-b-2 ${tab === id ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "summaries" ? (
                    <section className="py-6">
                        {current.summaries?.length ? (
                            <>
                                <div className="flex gap-2">
                                    {current.summaries.map((s) => (
                                        <button key={s._id} onClick={() => setSummaryId(s._id)} aria-pressed={summary?._id === s._id}
                                            className={`h-8 px-3 text-sm font-medium rounded-full border ${summary?._id === s._id ? "bg-ink text-white border-ink" : "bg-white border-line text-ink-2 hover:text-ink"}`}>
                                            {s.type}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-5 max-w-[68ch] text-[15px] leading-7 whitespace-pre-line text-ink">{summary?.content}</div>
                            </>
                        ) : (
                            <p className="text-sm text-ink-2">No summaries for this session yet.</p>
                        )}
                    </section>
                ) : (
                    <section className="py-6 max-w-[68ch]">
                        <h2 className="text-xl font-semibold">{course.title}</h2>
                        <p className="mt-2 text-[15px] leading-7 text-ink-2">{course.description}</p>
                        <p className="flex gap-4 mt-4 text-sm text-ink-3">
                            <span className="flex items-center gap-1.5"><LuListVideo size={15} aria-hidden />{sessions.length} sessions</span>
                            <span className="flex items-center gap-1.5"><LuUsers size={15} aria-hidden />{course.subscribers.length} learners</span>
                        </p>
                    </section>
                )}
            </div>

            <aside className="sticky top-0 bg-white border rounded-card border-line">
                <div className="p-5 border-b border-line">
                    <h2 className="font-semibold">Course content</h2>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-1.5 rounded-full bg-line">
                            <div className="h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-ink-3 tnum">{progress.length} of {sessions.length} done</span>
                    </div>
                </div>
                <ol className="py-2 list-none">
                    {sessions.map((s, i) => {
                        const done = progress.includes(s._id);
                        const isCurrent = s._id === currentId;
                        return (
                            <li key={s._id} className={`flex items-start gap-3 px-5 py-3 ${isCurrent ? "bg-accent-wash" : "hover:bg-page"}`}>
                                <button role="checkbox" aria-checked={done} aria-label={`Mark "${s.name}" as watched`} disabled={done}
                                    onClick={() => markWatched(s._id)}
                                    className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded border ${done ? "bg-accent border-accent text-white" : "border-zinc-300 bg-white hover:border-accent"}`}>
                                    {done && <LuCheck size={12} strokeWidth={3} />}
                                </button>
                                <button onClick={() => open(s._id)} className="flex-1 min-w-0 text-left" aria-current={isCurrent ? "true" : undefined}>
                                    <span className={`block text-sm leading-snug ${isCurrent ? "font-semibold" : ""}`}>{i + 1}. {s.name}</span>
                                    <span className="flex items-center gap-1 mt-1 text-xs text-ink-3">
                                        <LuPlay size={11} aria-hidden /> Video{s.summaries?.length ? ` · ${s.summaries.length} summaries` : ""}
                                        {isCurrent && <span className="ml-1 font-medium text-accent">· Up next</span>}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </aside>
        </div>
    );
};

export default SessionCard;
