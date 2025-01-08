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
    return NextResponse.json(
      { message: 'An error occurred', error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase()

    const commentId = await req.json()

    if (!commentId) {
      return NextResponse.json(
        { message: 'Comment ID are required' },
        { status: 400 }
      )
    }

    const deleteCommentAndReplies = async (id) => {
      const comment = await Comment.findById(id)
      if (!comment) throw new Error(`Comment with ID ${id} not found`)
      await Promise.all(comment.replies.map(deleteCommentAndReplies))
      await Comment.findByIdAndDelete(id)
    }

    await deleteCommentAndReplies(commentId)
    return NextResponse.json(
      { message: 'Comment and its replies deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error: error.message },
      { status: 500 }
    )
  }
}
