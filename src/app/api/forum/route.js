import { connectToDatabase } from '@/libs/mongo/config'
import Forum from '@/models/ForumModel'
import Tag from '@/models/TagModel'
import fs from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDatabase()

    const forums = await Forum.find({})
      .populate({
        path: 'tags',
        select: 'tag',
      })
      .populate({
        path: 'studentId',
        select: 'fullName',
      })

    const forumPost = forums.map((forum) => ({
      id: forum._id,
      title: forum.title,
      description: forum.description,
      publishDate: forum.publishDate,
      tags: forum.tags.map((tag) => tag.tag),
      studentName: forum.studentId.fullName,
      views: forum.views,
      likes: forum.likes,
      images: forum.images,
      comments: forum.comments,
      createdAt: forum.createdAt,
      updatedAt: forum.updatedAt,
    }))

    const tags = await Tag.find({})

    if (!tags) {
      return NextResponse.json({ message: 'No tags found' }, { status: 404 })
    }

    return NextResponse.json({ forumPost, tags })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectToDatabase()

    const formData = await req.formData()

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const studentId = formData.get('studentId')
    const title = formData.get('title')
    const description = formData.get('description')
    const tags = formData.getAll('tags')
    const files = formData.getAll('file')

    if (!studentId || !title || !description || !tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { message: 'Missing or invalid fields' },
        { status: 400 }
      )
    }

    const filePaths = []
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(uploadDir, file.name)

      await fs.writeFile(filePath, buffer)
      filePaths.push(`/uploads/${file.name}`)
    }

    const tagDocs = await Tag.find({ tag: { $in: tags } }).select('_id')
    const tagIds = tagDocs.map((tag) => tag._id)

    const newForumPost = await Forum.create({
      studentId,
      title,
      description,
      tags: tagIds,
      images: filePaths,
      publishDate: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        message: 'Forum post created successfully',
        forumPost: newForumPost,
        files: filePaths,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { message: 'An error occurred', error: error.message },
      { status: 500 }
    )
  }
}
