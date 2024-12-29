const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function registerNewUser(userData) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()
    if (data.message === 'User already exists') {
      return data
    }

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error('Error inserting new user:', error)
  }
}
