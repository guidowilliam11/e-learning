import { connectToDatabase } from '@/libs/mongo/config'
import Assignment from '@/models/AssignmentModel'
import Schedule from '@/models/ScheduleModel'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const studentId = url.searchParams.get('studentId')
    const date = url.searchParams.get('currentDate')

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    await connectToDatabase()

    const schedule = await Schedule.find({
      studentId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    return NextResponse.json(schedule)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectToDatabase()
    const { studentId, title, date } = await req.json()

    if (!studentId || !title || !date) {
      return NextResponse.json(
        { message: 'Title, and date are required.' },
        { status: 400 }
      )
    }

    const newAssignment = await Assignment.create({
      title: title,
      description: 'Write some description here.',
    })

    const newSchedule = await Schedule.create({
      studentId,
      title,
      date,
      assignmentId: newAssignment._id,
    })

    const populatedSchedule = await Schedule.findById(newSchedule._id).populate(
      'assignmentId'
    )

    return NextResponse.json(
      { message: 'Schedule created successfully', schedule: populatedSchedule },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await closeDatabase()
  }
}
