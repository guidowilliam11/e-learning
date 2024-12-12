import mongoose from 'mongoose'

let isConnected = false // Track the connection status

export async function connectToDatabase() {
  if (isConnected) return

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = db.connections[0].readyState === 1
    console.log('MongoDB connected successfully!')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}
