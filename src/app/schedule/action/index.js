const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchDailySchedule(user, date) {
  try {
    const response = await fetch(
      `${baseUrl}/api/schedule?studentId=${user.id}&currentDate=${date}`
    )

    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching schedule:', error)
  }
}

export async function insertSchedule(studentId, title, date) {
  try {
    const schedule = { studentId, title, date }

    const response = await fetch(`${baseUrl}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedule),
    })

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error insert schedule', error)
  }
}

export async function updateScheduleCheckStatus(scheduleId, checkStatus) {
  try {
    const scheduleToChange = { scheduleId, checkStatus }

    const response = await fetch(`${baseUrl}/api/schedule/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleToChange),
    })

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error update check status in schedule', error)
  }
}

export async function fetchAssignmentByAssignmentId(assignmentId) {
  try {
    const response = await fetch(
      `${baseUrl}/api/assignment?assignmentId=${assignmentId}`
    )

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error fetching assignment:', error)
  }
}

export async function updateAssignment(id, title, desc, list) {
  try {
    const assignment = { id, title, desc, list }

    const response = await fetch(`${baseUrl}/api/assignment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignment),
    })

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.error('Error saving edited assignment', error)
  }
}
