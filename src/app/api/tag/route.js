import { connectToDatabase } from '@/libs/mongo/config'
import Tag from '@/models/TagModel'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tags = await Tag.find({})
    if (!tags) {
      return NextResponse.json({ message: 'No tags found' }, { status: 404 })
    }

    return NextResponse.json({ tags })
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error: error.message },
      { status: 500 }
    )
  }
}

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

    return NextResponse.json(
      { message: 'Tags created successfully', tags: newTags },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
