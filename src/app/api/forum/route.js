import { connectToDatabase } from "@/libs/mongo/config";
import Forum from "@/models/ForumModel";
import Tag from "@/models/TagModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase()

    const forum = await Forum.find({})

    const tags = await Tag.find({})

    if (!tags) {
      return NextResponse.json({ message: 'No tags found' }, { status: 404 })
    }

    return NextResponse.json({ forum, tags })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectToDatabase()

    const { studentId, title, tags } = await req.json()

    if (!studentId, !title, !tags) {
      return NextResponse.json(
        { error: 'Student ID, title, and tag is required' },
        { status: 400 }
      )
    }

    const newForumPost = await Forum.create({
      studentId,
      publishDate: new Date().toISOString(),
      content: title,
      tags,
    })

    return NextResponse.json(
      { message: 'Forum post created successfully', forumPost: newForumPost },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}