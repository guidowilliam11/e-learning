import { connectToDatabase } from "@/libs/mongo/config"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import Students from "@/models/StudentModel"

export async function PUT(req) {
  try {

    const newPreferences = await req.json()

    const { user } = await getServerSession(authOptions)

    await connectToDatabase()

    const student = await Students.findByIdAndUpdate(user.id, {
      preferences: newPreferences
    }, {
      new: true
    })

    return NextResponse.json(student.toObject())

  } catch (error) {
    console.error('Error when trying to update perferences: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}