const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchForumPost(id) {
  try {
    const response = await fetch(`${baseUrl}/api/forum-post?id=${id}`)

    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`)
      if (response.status === 404) {
        return { error: 'Forum not found' }
      }
      throw new Error('Failed to fetch forum post')
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

export async function fetchForumPostNotView(id) {
  try {
    const response = await fetch(
      `${baseUrl}/api/forum-post?id=${id}&incrementViews=false`
    )

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

export async function fetchForumPostMoreComments(id, commentDepth) {
  try {
    const response = await fetch(
      `${baseUrl}/api/forum-post?id=${id}&incrementViews=false&commentDepth=${commentDepth}`
    )

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
    console.error('Error update like to post:', error)
  }
}

export async function insertCommentToPost(forumId, studentId, content) {
  try {
    const commentPost = { content, forumId, studentId }

    const response = await fetch(`${baseUrl}/api/forum-post/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentPost),
    })

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error insert comment to post: ', error)
  }
}

export async function updateLikeToComment(commentId, studentId) {
  try {
    const likedComment = { commentId, studentId }

    const response = await fetch(`${baseUrl}/api/forum-post/comment/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(likedComment),
    })

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error update like to comment:', error)
  }
}

export async function insertReplyToComment(commentId, studentId, content) {
  try {
    const commentPost = { content, commentId, studentId }

    const response = await fetch(`${baseUrl}/api/forum-post/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentPost),
    })

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error insert reply to comment: ', error)
  }
}

export async function deleteComment(commentId) {
  try {
    const response = await fetch(`${baseUrl}/api/forum-post/comment`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentId),
    })

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error deleting comment: ', error)
  }
}