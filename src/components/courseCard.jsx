"use client";

import Link from "next/link";
import { useState } from "react";
import { LuPlay, LuUsers, LuListVideo } from "react-icons/lu";

export default function CourseCard({ _id, thumbnail, title, description, subscribers, total, watched, pct, state }) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link href={"/courses/" + _id} className="group flex flex-col overflow-hidden bg-white border rounded-card border-line hover:border-zinc-300">
            <div className="relative overflow-hidden aspect-video bg-page">
                {imageError || !thumbnail ? (
                    <div className="grid w-full h-full text-3xl font-semibold place-items-center text-accent bg-accent-wash">{title.charAt(0)}</div>
                ) : (
                    <img src={thumbnail} alt="" onError={() => setImageError(true)} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]" />
                )}
                <span className="absolute grid transition-opacity bg-white rounded-full opacity-0 size-12 place-items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink group-hover:opacity-100 shadow-md">
                    <LuPlay size={20} className="ml-0.5" />
                </span>
            </div>

            <div className="flex flex-col flex-1 p-4">
                <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-accent">{title}</h3>
                <p className="mt-1 text-sm text-ink-2 line-clamp-2">{description}</p>
                <p className="flex items-center gap-3 mt-3 text-xs text-ink-3">
                    <span className="flex items-center gap-1"><LuListVideo size={14} aria-hidden />{total} sessions</span>
                    <span className="flex items-center gap-1"><LuUsers size={14} aria-hidden />{subscribers?.length ?? 0} learners</span>
                </p>

                <div className="pt-4 mt-auto">
                    {state === "new" ? (
                        <span className="text-sm font-semibold text-accent">Start course</span>
                    ) : (
                        <>
                            <div className="h-1 rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${title} progress`}>
                                <div className={`h-1 rounded-full ${state === "done" ? "bg-emerald-600" : "bg-accent"}`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className="flex justify-between mt-2 text-xs text-ink-3">
                                <span>{state === "done" ? "Completed" : `${pct}% complete`}</span>
                                <span className="tnum">{watched}/{total}</span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
