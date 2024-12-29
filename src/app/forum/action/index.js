const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchForumsAndTags() {
  try {
    const response = await fetch(`${baseUrl}/api/forum`)

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}
