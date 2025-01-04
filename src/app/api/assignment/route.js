import { connectToDatabase } from '@/libs/mongo/config'
import Assignment from '@/models/AssignmentModel'
import Schedule from '@/models/ScheduleModel'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const assignmentId = url.searchParams.get('assignmentId')

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const assignment = await Assignment.findOne({
      _id: assignmentId,
    })

    if (!assignment || assignment.length === 0) {
      return NextResponse.json(
        { message: 'No assignment found for the given Assignment ID' },
        { status: 404 }
      )
    }

    return NextResponse.json(assignment)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  } finally {
    await closeDatabase()
  }
}

export async function POST(req) {
  try {
    await connectToDatabase()

    const { id, title, desc, list } = await req.json()

    if (!id || !title || !desc || !list) {
      return NextResponse.json(
        { error: 'Assignment ID, title, description, and list is required' },
        { status: 400 }
      )
    }

    const editedSchedule = await Schedule.findOneAndUpdate(
      { assignmentId: id },
      { title: title },
      { new: true }
    )

    if (!editedSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    const editedAssignment = await Assignment.findByIdAndUpdate(
      id,
      {
        title,
        description: desc,
        list,
      },
      { new: true }
    )

    if (!editedAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        schedule: editedSchedule,
        assignment: editedAssignment,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  } finally {
    await closeDatabase()
  }
}
