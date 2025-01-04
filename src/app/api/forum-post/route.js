import { connectToDatabase } from '@/libs/mongo/config'
import Forum from '@/models/ForumModel'
import { NextResponse } from 'next/server'

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

    const forum = await Forum.findOne({
      _id: forumId,
    })
      .populate({
        path: 'tags',
        select: 'tag',
      })
      .populate({
        path: 'studentId',
        select: 'fullName',
      })

    const forumPopulated = {
      ...forum.toObject(),
      tags: forum.tags.map((tag) => tag.tag),
    }

    return NextResponse.json(forumPopulated)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
