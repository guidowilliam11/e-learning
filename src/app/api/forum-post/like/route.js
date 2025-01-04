import { connectToDatabase } from '@/libs/mongo/config'
import Forum from '@/models/ForumModel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectToDatabase()

    const { forumId, studentId } = await req.json()

    if (!forumId || !studentId) {
      return NextResponse.json(
        { message: 'Forum ID and Student ID are required' },
        { status: 400 }
      )
    }

    const forum = await Forum.findById(forumId)

    if (!forum) {
      console.log('Found')
      return NextResponse.json({ message: 'Forum not found' }, { status: 400 })
    }

    const hasLiked = forum.likedBy.includes(studentId)

    if (hasLiked) {
      forum.likedBy = forum.likedBy.filter((id) => id.toString() !== studentId)
    } else {
      forum.likedBy.push(studentId)
    }

    await forum.save()

    return NextResponse.json({
      message: hasLiked ? 'Post unliked' : 'Post liked',
      likes: forum.likes,
    })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
