import { connectToDatabase } from '@/libs/mongo/config'
import Forum from '@/models/ForumModel'
import Tag from '@/models/TagModel'
import path from 'path'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { createClient } from '@/libs/supabase/config'
import Comment from '@/models/CommentModel'

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
      likedBy: forum.likedBy,
      images: forum.images,
      comments: forum.comments,
      createdAt: forum.createdAt,
      updatedAt: forum.updatedAt,
    }))

    return NextResponse.json(forumPost)
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    await connectToDatabase()
    const supabase = await createClient()

    const formData = await req.formData()

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

    const newId = new Types.ObjectId()

    const filePaths = []
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = path.join(newId.toString(), file.name)

      const { data, error } = await supabase.storage
        .from('forum')
        .upload(filePath, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (data) {
        filePaths.push(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
        )
      }

      if (error) {
        throw error
      }
    }

    const tagDocs = await Tag.find({ tag: { $in: tags } }).select('_id')
    const tagIds = tagDocs.map((tag) => tag._id)

    const newForumPost = await Forum.create({
      _id: newId,
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

export async function PATCH(req) {
  try {
    await connectToDatabase()
    const supabase = await createClient()

    const formData = await req.formData()

    const forumId = formData.get('forumId')
    const studentId = formData.get('studentId')
    const title = formData.get('title')
    const description = formData.get('description')
    const tags = formData.getAll('tags')
    const files = formData.getAll('file')

    if (
      !forumId ||
      !studentId ||
      !title ||
      !description ||
      !tags ||
      !Array.isArray(tags)
    ) {
      return NextResponse.json(
        { message: 'Missing or invalid fields' },
        { status: 400 }
      )
    }

    const folderPath = forumId.toString()

    const { data: existingFiles, error: fetchError } = await supabase.storage
      .from('forum')
      .list(folderPath, { limit: 100 })

    if (fetchError) {
      throw new Error(
        `Error fetching files from Supabase: ${fetchError.message}`
      )
    }

    const existingFilePaths =
      existingFiles?.map((file) => `${folderPath}/${file.name}`) || []

    const currentFilePaths = files
      .filter((file) => typeof file === 'string')
      .map((url) => {
        const parts = url.split('/')
        return `${folderPath}/${parts[parts.length - 1]}`
      })

    const filesToDelete = existingFilePaths.filter(
      (path) => !currentFilePaths.includes(path)
    )

    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from('forum')
        .remove(filesToDelete)

      if (deleteError) {
        throw new Error(`Error deleting files: ${deleteError.message}`)
      }
    }

    const filePaths = []

    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const filePath = path.join(forumId.toString(), file.name)

        const { data, error } = await supabase.storage
          .from('forum')
          .upload(filePath, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          })

        if (data) {
          filePaths.push(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
          )
        }

        if (error) {
          throw error
        }
      } else {
        filePaths.push(file)
      }
    }

    const tagDocs = await Tag.find({ tag: { $in: tags } }).select('_id')
    const tagIds = tagDocs.map((tag) => tag._id)

    const updatedForumPost = await Forum.findByIdAndUpdate(
      forumId,
      {
        studentId,
        title,
        description,
        tags: tagIds,
        images: filePaths,
      },
      {
        new: true,
        upsert: false,
      }
    )

    if (!updatedForumPost) {
      throw new Error(`Forum post with ID ${newId} not found.`)
    }

    return NextResponse.json(
      {
        message: 'Forum post updated successfully',
        forumPost: updatedForumPost,
        files: filePaths,
      },
      { status: 201 }
    )
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
    const supabase = await createClient()

    const forumId = await req.json()

    if (!forumId) {
      return NextResponse.json(
        { message: 'Forum ID is required' },
        { status: 400 }
      )
    }

    const forum = await Forum.findById(forumId).populate('comments')

    if (!forum) {
      return NextResponse.json(
        { message: `Forum post with ID ${forumId} not found` },
        { status: 404 }
      )
    }

    const folderPath = forumId.toString()
    const { data: files, error: listError } = await supabase.storage
      .from('forum')
      .list(folderPath, { limit: 100 })

    if (listError) {
      throw new Error(
        `Error fetching files from Supabase: ${listError.message}`
      )
    }

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${folderPath}/${file.name}`)
      const { error: deleteError } = await supabase.storage
        .from('forum')
        .remove(filePaths)

      if (deleteError) {
        throw new Error(
          `Error deleting files from Supabase: ${deleteError.message}`
        )
      }
    }

    const deleteCommentsAndReplies = async (commentIds) => {
      for (const commentId of commentIds) {
        const comment = await Comment.findById(commentId)

        if (comment) {
          await deleteCommentsAndReplies(comment.replies)
          await Comment.findByIdAndDelete(commentId)
        }
      }
    }

    await deleteCommentsAndReplies(forum.comments)

    await Forum.findByIdAndDelete(forumId)

    return NextResponse.json(
      {
        message: `Forum post with ID ${forumId} and its related data deleted successfully`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'An error occurred', error: error.message },
      { status: 500 }
    )
  }
}
