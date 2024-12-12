import { connectToDatabase } from '@/libs/mongo/config'
import User from '@/models/userModel'
import bcrypt from 'bcrypt'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    await connectToDatabase()

    const user = await User.findOne({ email })
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
