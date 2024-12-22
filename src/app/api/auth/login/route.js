import { connectToDatabase } from '@/libs/mongo/config'
import Students from '@/models/StudentModel'
import bcrypt from 'bcrypt'

export async function POST(req) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    await connectToDatabase()

    const user = await Students.findOne({ email })
    console.log("Hai : ", user.email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res
      .status(200)
      .json({ message: 'Login successful', user: { email: user.email } })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
