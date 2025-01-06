import { connectToDatabase } from '@/libs/mongo/config'
import Comment from '@/models/CommentModel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectToDatabase()

    const { commentId, content, studentId } = await req.json()

    if (!commentId || !content || !studentId) {
      return NextResponse.json(
        { message: 'Content, Forum ID, and Student ID are required' },
        { status: 400 }
      )
    }

    const newReply = await Comment.create({
      studentId,
      content,
    })

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: newReply._id } },
      { new: true }
    )

    if (!comment) {
      return NextResponse.json(
        { message: 'Comment update failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Reply added successfully',
      comment: comment,
    })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
