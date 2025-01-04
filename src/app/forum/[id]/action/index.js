const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchForumPost(id) {
  try {
    const response = await fetch(`${baseUrl}/api/forum-post?id=${id}`)

    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching post:', error)
  }
}

export async function updateLikeToPost(forumId, studentId) {
  try {
    const likedPost = { forumId, studentId }

    const response = await fetch(`${baseUrl}/api/forum-post/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(likedPost),
    })

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error saving like to post:', error)
  }
}
