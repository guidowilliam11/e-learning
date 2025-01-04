import { closeDatabase, connectToDatabase } from '@/libs/mongo/config'
import Tag from '@/models/TagModel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { tags } = await req.json()

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'An array of tags is required and cannot be empty' },
        { status: 400 }
      )
    }
    await connectToDatabase()

    const newTags = await Tag.insertMany(tags.map((tag) => ({ tag })))
    await closeDatabase()
    return NextResponse.json(
      { message: 'Tags created successfully', tags: newTags },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
