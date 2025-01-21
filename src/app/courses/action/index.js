const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchCourses() {
    try {
        const response = await fetch(`${baseUrl}/api/courses`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function fetchSessions(courseId) {
    try {
        const response = await fetch(`${baseUrl}/api/courses/${courseId}`);

        if(!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function addProgress(courseId, sessionId) {
    try {
        const response = await fetch(`${baseUrl}/api/courses/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({courseId, sessionId}),
        });

        if(!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}