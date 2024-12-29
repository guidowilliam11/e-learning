import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import Communities from "@/models/CommunityModel"
import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"

export async function GET(req) {
  try {
    const url = new URL(req.url)

    const communityId = url.searchParams.get('communityId')
    if (!communityId) {
      return NextResponse.json({ error: 'COMMUNITY_ID_REQUIRED' }, { status: 400 })
    }

    const community = await Communities.findById(communityId).populate('participants', 'fullName picture email')

    return NextResponse.json(community)

  } catch (error) {
    console.error('Error when getting community data: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const newCommunity = {}
    const formData = await req.formData()

    const session = await getServerSession(authOptions)

    const { user } = session

    newCommunity.name = formData.get('name')
    newCommunity.participants = formData.get('participants')
    const picture = formData.get('picture')

    if (picture) {
      const bufferBytes = await picture.arrayBuffer()
      const buffer = Buffer.from(bufferBytes)

      const pictureExtension = picture.name.split('.').pop()
      const newPictureName = `${crypto.randomUUID()}.${pictureExtension}`

      const path = `/community/community-display-pictures/${newPictureName}`
      const relativePath = `public${path}`
      await writeFile(relativePath, buffer)

      newCommunity.picture = path
    } else {
      newCommunity.picture = '/public/images/default-community-picture.png'
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
    const { communityId } = await req.json()

    if (!communityId) {
      return NextResponse.json({ error: 'COMMUNITY_ID_REQUIRED' }, { status: 400 })
    }

    const { user } = await getServerSession(authOptions)

    const community = await Communities.findById(communityId)

    const userIndex = community.participants.indexOf(user.id)

    community.participants.splice(userIndex, 1)
    await community.save()

    return NextResponse.json({ message: 'You have left the community.' })
  } catch (error) {
    console.error('Error when leaving community: ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}