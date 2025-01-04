"use client";

import React, { useState, useEffect } from 'react';
import {FaWatchmanMonitoring} from "react-icons/fa";
import {MdDoneAll} from "react-icons/md";

const SessionCard = ({ user }) => {
    const [sessions, setSessions] = useState([]);
    const [course, setCourse] = useState();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch('/api/courses/64a7f5e8d8f1b1c0d1234570');
                const data = await res.json(); // Parse the JSON response

                if (data.course && data.course.sessions) {
                    setSessions(data.course.sessions);
                    setCourse(data.course);
                } else {
                    console.warn('No sessions found in the API response');
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
    }, []);

    return (
        <div className="flex flex-col w-full h-auto overflow-y-auto gap-2">
            {sessions.map((session) => {
                const embedUrl = `https://www.youtube.com/embed/${session.video.split('v=')[1] || session.video}`;

                return (
                    <div key={session._id} className="w-full bg-white rounded-lg shadow-md flex">
                        <iframe
                            className="w-[35%] h-[15vw]"
                            src={embedUrl}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={session.name}
                        ></iframe>
                        <div className="p-4 text-xl flex">
                            <h1>{session.name}</h1>
                            <MdDoneAll />
                        </div>
                    </div>
                );
            })}
        </div>
    );

};

export default SessionCard;
