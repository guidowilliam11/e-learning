import { connectToDatabase } from '@/libs/mongo/config'
import Schedule from '@/models/ScheduleModel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectToDatabase()
    const { scheduleId, checkStatus } = await req.json()

    if (scheduleId == null || checkStatus == null) {
      return NextResponse.json(
        { message: 'Schedule ID and check status are required.' },
        { status: 400 }
      )
    }

    const checkedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { checked: checkStatus },
      { new: true }
    )

    return NextResponse.json(
      { message: 'Schedule checked successfully', schedule: checkedSchedule },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
