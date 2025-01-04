import { closeDatabase, connectToDatabase } from '@/libs/mongo/config'
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

    await closeDatabase()
    return NextResponse.json(forum)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
