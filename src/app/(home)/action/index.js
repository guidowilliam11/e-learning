const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchFocusedHours() {
  try {
    const response = await fetch(`${baseUrl}/api/productivity`) // Replace with the correct API endpoint
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching focused hours:', err)
  }
}

export async function fetchDailyQuote() {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
      headers: {
        'X-Api-Key': 'xWs/pH9MclhuL0xsgCPPQw==fLz9tiV7Uh3ec1Ln',
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return data[0]
  } catch (error) {
    console.error('Error fetching daily quote:', err)
  }
}

export async function addProductivityHour() {
  try {
    const response = await fetch('/api/productivity', {
      method: 'PUT',
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
  } catch (error) {
    console.error('Failed to add productivity hour:', error.message)
  }
}
