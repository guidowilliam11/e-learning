"use client";

import React, { useState, useEffect } from "react";
import Tag from "@/components/Tag";
import {FaFile, FaX} from "react-icons/fa6";
import {FaRegFileAlt} from "react-icons/fa";
import {toast} from "react-toastify";

const SessionCard = ({ user, courseId }) => {
    const [sessions, setSessions] = useState([]);
    const [course, setCourse] = useState();
    const [progress, setProgress] = useState([]);
    const [reload, setReload] = useState(false);
    const [summarizeModal, setSummarizeModal] = useState(false);
    const [summarizeHeader, setSummarizeHeader] = useState([]);
    const [summaryContent, setSummaryContent] = useState();
    const [summaryChosen, setSummaryChosen] = useState();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch(`/api/courses/${courseId}`);
                const data = await res.json(); // Parse the JSON response

                if (data.course && data.course.sessions) {
                    setSessions(data.course.sessions);
                    setCourse(data.course);

                    // Get current user's progress in percentage
                    const currentUserProgress = data.course.subscribers.find(
                        (subscriber) => subscriber.studentId === user.id
                    )?.progress;

                    setProgress(currentUserProgress || []);
                } else {
                    console.warn("No sessions found in the API response");
                }
            } catch (error) {
                console.error("Error fetching sessions:", error);
            }
        };

        fetchSessions();
    }, [courseId, reload]); // Include courseId in the dependency array

    const updateProgress = async (sessionId) => {
        try {
            if(progress.includes(sessionId)){
                return;
            }

            const res = await fetch(`/api/courses/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ courseId, sessionId }),
            });

            if (!res.ok) {
                console.error("Failed to update progress");
                toast.error("Failed to update progress")
                return;
            }

            setReload((prev) => !prev);
            toast.success("Successfuly updated progress")
        } catch (error) {
            console.error("Error updating progress:", error);
            toast.error("Error updating progress");
        }
    };

    return (
        <div className="flex w-full h-full gap-5">
            <div className="flex flex-col w-full h-auto overflow-y-auto gap-2">
                {sessions.map((session, index) => {
                    const embedUrl = `https://www.youtube.com/embed/${session.video.split('v=')[1] || session.video}`;

                    return (
                        <div
                            key={session._id}
                            className="w-full bg-white rounded-lg shadow-md flex"
                            onClick={() => updateProgress(session._id)} // Pass session ID when clicked
                        >
                            <iframe
                                className={`${summarizeModal ? "w-[50%]" : "w-[35%]"} h-[15vw]`}
                                src={embedUrl}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={session.name}
                            ></iframe>

                            <div className="p-4 flex flex-col flex-grow gap-3">
                                <div
                                    className=" text-xl flex h-fit items-center justify-between w-full">
                                    <h1>{session.name}</h1>
                                    {/* Show MdDoneAll if the session is within the completed count */}
                                    {progress.includes(session._id) ? (
                                        <Tag value="Watched" color="bg-green-400"/>
                                    ) : (
                                        <Tag value="Continue" color="bg-orange-400"/>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setSummarizeModal(true);
                                        setSummarizeHeader(session.summaries);
                                        setSummaryContent(session.summaries[0].content);
                                        setSummaryChosen(session.summaries[0]._id);
                                    }}
                                    className="w-fit bg-primary rounded-full text-white px-4 py-2 shadow-md hover:bg-orange-600 transition-all duration-300 ease-in-out transform hover:shadow-lg">View Summaries</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {summarizeModal && (
                <div className=" w-[50%] bg-white rounded-lg shadow-md flex flex-col">
                    {/* Header */}
                    <div
                        className="bg-secondary p-4 flex rounded-t-lg justify-between items-center">
                        <h1 className="text-xl text-white font-bold">Summaries:</h1>
                        <div
                            className="rounded-full p-2 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                            onClick={() => setSummarizeModal(false)} // Properly close the modal
                        >
                            <FaX className="text-gray-600"/>
                        </div>
                    </div>

                    {/* Summaries Content */}
                    <div className="px-4 flex flex-wrap gap-2">
                        {summarizeHeader.map((summary) => (
                            <button
                                onClick={() => {
                                    setSummaryContent(summary.content)
                                    setSummaryChosen(summary._id)
                                }}
                                key={summary._id}
                                className={`h-fit w-fit bg-primary rounded-b-2xl text-white px-4 py-2 shadow-xl transition-all duration-300 ease-in-out transform hover:shadow-lg ${
                                    summaryChosen == summary._id ? "pt-5" : "pt-2"
                                }`}>
                                {summary.type}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 h-full w-full overflow-y-auto border-gray-300 border-1">
                        {summaryContent}
                    </div>
                </div>
            )}

        </div>
    );
};

export default SessionCard;
