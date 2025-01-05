"use client";

import Image from "next/image";
import { useState } from "react";

export default function CourseCard({
                                       thumbnail,
                                       title,
                                       description,
                                       subscribers,
                                       sessions,
                                       _id,
                                       currentUserId,
                                   }) {
    const [imageError, setImageError] = useState(false);

    let totalSessions = sessions.length;
    return (
        <a href={"courses/" + _id}>
            <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                {/* Course Logo */}
                <div className="h-52 bg-gray-100 flex items-center justify-center">
                    {imageError ? (
                        <div className="w-full h-full bg-[#E5E7FB] flex items-center justify-center text-white text-lg font-bold">
                            {title.charAt(0)}{" "}
                            {/* First letter of the title as placeholder text */}
                        </div>
                    ) : (
                        <Image
                            src={thumbnail}
                            alt={`${title} logo`}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                            onError={() => setImageError(true)}
                            priority
                        />
                    )}
                </div>

                {/* Course Info */}
                <div className="p-4 flex flex-grow flex-col justify-evenly">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>

                    <div>
                        <div className="border-t border-gray-200 my-3"></div>

                        {/* Progress */}
                        {subscribers.find(
                            (subscriber) => subscriber.studentId === currentUserId
                        )?.progress.length > 0 ? (
                            <div className="mt-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Progress: </span>
                                    <span className="text-xs text-gray-600">
                    {Math.round(
                        (subscribers.find(
                                (subscriber) => subscriber.studentId === currentUserId
                            )?.progress.length /
                            totalSessions) *
                        100
                    )}/100
                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                    <div
                                        className="bg-orange-400 h-2.5 rounded-full"
                                        style={{
                                            width: `${Math.round(
                                                (subscribers.find(
                                                        (subscriber) => subscriber.studentId === currentUserId
                                                    )?.progress.length /
                                                    totalSessions) *
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">
                                No progress available for this user.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
}
