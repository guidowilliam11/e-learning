import { connectToDatabase } from '@/libs/mongo/config'
import Students from '@/models/StudentModel'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, password } = req.body

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    )
  }

  try {
    await connectToDatabase()

    const user = await Students.findOne({ email })
    console.log('Hai : ', user.email)
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { message: 'Login successful', user: { email: user.email } },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
