const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchNotes() {
    try {
        const response = await fetch(`${baseUrl}/api/folder`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteNote(noteId) {
    try {
        const response = await fetch(`${baseUrl}/api/folder/notes`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({noteId}),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function editNote(noteId, updatedTopic) {
    try {
        const response = await fetch(`${baseUrl}/api/folder/notes`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({noteId, updatedTopic}),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteFolder(folderId) {
    try {
        const response = await fetch(`${baseUrl}/api/folder/`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({folderId} ),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function editFolder(folderId, updatedName) {
    try {
        const response = await fetch(`${baseUrl}/api/folder`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({folderId, updatedName} ),
        })
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}