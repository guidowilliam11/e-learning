'use server'

export async function fetchDailySchedule(user, date) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/schedule?studentId=${user.id}&currentDate=${date}`
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching schedule:', error.message)
  }
}
