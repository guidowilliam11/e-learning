import { connectToDatabase } from '@/libs/mongo/config'
import Forum from '@/models/ForumModel'
import { NextResponse } from 'next/server'

const populateReplies = (depth = 4) => {
  if (depth === 0) return []

  return [
    {
      path: 'replies',
      populate: [
        { path: 'studentId', select: 'fullName' },
        ...populateReplies(depth - 1),
      ],
    },
  ]
}

export async function GET(req) {
  try {
    await connectToDatabase()

    const url = new URL(req.url)
    const forumId = url.searchParams.get('id')

    if (!forumId) {
      return NextResponse.json(
        { error: 'Forum ID is required' },
        { status: 400 }
      )
    }

    const incrementViews = url.searchParams.get('incrementViews') !== 'false'

    const forum = await Forum.findOneAndUpdate(
      { _id: forumId },
      incrementViews ? { $inc: { views: 1 } } : {},
      { new: true }
    )
      .populate({
        path: 'tags',
        select: 'tag',
      })
      .populate({
        path: 'studentId',
        select: 'fullName',
      })
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'studentId',
            select: 'fullName',
          },
          ...populateReplies(),
        ],
      })

    const forumPopulated = {
      ...forum.toObject(),
      tags: forum.tags.map((tag) => tag.tag),
    }

    return NextResponse.json(forumPopulated)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
