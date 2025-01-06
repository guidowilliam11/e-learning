const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchForumsAndTags() {
  try {
    const response = await fetch(`${baseUrl}/api/forum`)

    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching forums and tags:', error)
  }
}

export async function insertNewForumPost(formData) {
  try {
    const response = await fetch(`${baseUrl}/api/forum`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to upload forum post')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error uploading forum post:', error)
  }
}
