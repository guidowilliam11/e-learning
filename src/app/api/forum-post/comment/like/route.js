import { connectToDatabase } from '@/libs/mongo/config'
import Comment from '@/models/CommentModel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectToDatabase()

    const { commentId, studentId } = await req.json()

    if (!commentId || !studentId) {
      return NextResponse.json(
        { message: 'Forum ID and Student ID are required' },
        { status: 400 }
      )
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 400 })
    }

    const hasLiked = comment.likedBy.includes(studentId)

    if (hasLiked) {
      comment.likedBy = comment.likedBy.filter((id) => id.toString() !== studentId)
    } else {
      comment.likedBy.push(studentId)
    }

    await comment.save()

    return NextResponse.json({
      message: hasLiked ? 'Comment unliked' : 'Comment liked',
      likes: comment.likes,
    })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
