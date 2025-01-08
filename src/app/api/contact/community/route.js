import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import Communities from "@/models/CommunityModel"
import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { createClient } from "@/libs/supabase/config"

export async function GET(req) {
  try {
    const url = new URL(req.url)

    const communityId = url.searchParams.get('communityId')
    if (!communityId) {
      return NextResponse.json({ error: 'COMMUNITY_ID_REQUIRED' }, { status: 400 })
    }

    const community = await Communities.findById(communityId).populate('participants', 'fullName picture email')

    if (!community) {
      return NextResponse.json({ error: 'COMMUNITY_NOT_FOUND' }, { status: 404 })
    }

    return NextResponse.json(community)

  } catch (error) {
    console.error('Error when getting community data: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {

    const { user } = await getServerSession(authOptions)

    const formData = await req.formData()

    const newCommunity = {}
    newCommunity.name = formData.get('name')
    newCommunity.participants = formData.get('participants').split(',')
    const picture = formData.get('picture') === 'null' ? null : formData.get('picture')

    if (picture) {
      const supabase = await createClient()
      const bufferBytes = await picture.arrayBuffer()
      const buffer = Buffer.from(bufferBytes)

      const pictureExtension = picture.name.split('.').pop()
      const filePath = `${crypto.randomUUID()}.${pictureExtension}`

      const { data, error } = await supabase.storage
        .from('profile')
        .upload(filePath, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: picture.type,
        })

      if (data) {
        newCommunity.picture = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
      }
      if (error) {
        newCommunity.picture = ''
        throw error
      }
    }

    newCommunity.participants.push(user.id)
    const community = await Communities.create(newCommunity)

    return NextResponse.json(community.toObject())
  } catch (error) {
    console.error('Error when creating community: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const formData = await req.formData()

    const communityId = formData.get('communityId')
    const community = await Communities.findById(communityId)

    const newName = formData.get('name')
    const newDescription = formData.get('description')
    let newPicture = null
    const picture = formData.get('picture')

    if (picture && typeof picture !== 'string') {
      const bufferBytes = await picture.arrayBuffer()
      const buffer = Buffer.from(bufferBytes)

      const pictureExtension = picture.name.split('.').pop()
      const newPictureName = `${crypto.randomUUID()}.${pictureExtension}`

      const path = `/community/community-display-pictures/${newPictureName}`
      const relativePath = `public${path}`
      await writeFile(relativePath, buffer)

      newPicture = path
    }

    community.name = newName ?? community.name
    community.description = newDescription ?? community.description
    community.picture = newPicture ?? community.picture
    await community.save()

    return NextResponse.json(community.toObject())

  } catch (error) {
    console.error('Error when creating community: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { communityId, studentId } = await req.json()

    if (!communityId) {
      return NextResponse.json({ error: 'COMMUNITY_ID_REQUIRED' }, { status: 400 })
    }
    if (!studentId) {
      return NextResponse.json({ error: 'STUDENT_ID_REQUIRED' }, { status: 400 })
    }


    const community = await Communities.findById(communityId)

    const userIndex = community.participants.indexOf(studentId)

    community.participants.splice(userIndex, 1)
    await community.save()

    await community.populate('participants', 'fullName picture email')

    return NextResponse.json(community.toObject())
  } catch (error) {
    console.error('Error when leaving community: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}