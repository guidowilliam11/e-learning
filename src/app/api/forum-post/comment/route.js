import { connectToDatabase } from '@/libs/mongo/config'
import Comment from '@/models/CommentModel'
import Forum from '@/models/ForumModel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectToDatabase()

    const { forumId, content, studentId } = await req.json()

    if (!forumId || !content || !studentId) {
      return NextResponse.json(
        { message: 'content, Forum ID, and Student ID are required' },
        { status: 400 }
      )
    }

    const newComment = await Comment.create({ content, studentId })

    const forum = await Forum.findByIdAndUpdate(
      forumId,
      { $push: { comments: newComment._id } },
      { new: true }
    )

    if (!forum) {
      return NextResponse.json(
        { message: 'Forum update failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Comment added successfully',
      forum: forum,
    })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
