import { connectToDatabase } from '@/libs/mongo/config'
import Forum from '@/models/ForumModel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectToDatabase()

    const { forumId, studentId } = req.json()

    if (!forumId || !studentId) {
      return NextResponse.json(
        { message: 'Forum ID and User ID are required' },
        { status: 400 }
      )
    }

    const forum = await Forum.findById(forumId)

    if (!forum) {
      return NextResponse.json({ message: 'Forum not found' }, { status: 400 })
    }

    const hasLiked = forum.likedBy.includes(studentId)

    if (hasLiked) {
      forum.likedBy = forum.likedBy.filter((id) => id.toString() !== userId)
      forum.likes -= 1
    } else {
      // Like the post
      forum.likedBy.push(userId)
      forum.likes += 1
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
