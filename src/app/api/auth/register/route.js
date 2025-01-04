import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import Students from '@/models/StudentModel'
import { connectToDatabase } from '@/libs/mongo/config'

export async function POST(req) {
  try {
    await connectToDatabase()

    const { fullName, email, password } = await req.json()

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if the user already exists
    const existingUser = await Students.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new Students({ fullName, email, password: hashedPassword })
    await newUser.save()

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error during signup:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await closeDatabase()
  }
}
