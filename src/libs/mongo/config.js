import mongoose from 'mongoose'

let isConnected = false

export async function connectToDatabase() {
  if (isConnected) return

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI)

    isConnected = db.connections[0].readyState === 1
    console.log('MongoDB connected successfully!')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

export async function closeDatabase() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    } else {
      console.log('No active database connection to close')
    }
  } catch (error) {
    console.error('Error while closing database connection', error)
  }
}
