"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Communities from "@/models/CommunityModel"
import { _responseAdapter, _serverActionDataAdapter } from "@/utils/adapter"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { writeFile } from "fs/promises"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getPeers = async () => {
  const session = await getServerSession(authOptions)

  const { user } = session

  return fetch(`${baseUrl}/api/contact/peers?currUserId=${user.id}`).then(_responseAdapter).then(_serverActionDataAdapter)
}

export const createCommunity = async (newCommunity) => {
  try {

    const session = await getServerSession(authOptions)
    !session && redirect('/login')

    const { user } = session

    const picture = newCommunity.picture

    if (picture) {
      const bufferBytes = await picture.arrayBuffer()
      const buffer = Buffer.from(bufferBytes)

      const pictureExtension = picture.name.split('.').pop()
      const newPictureName = `${crypto.randomUUID()}.${pictureExtension}`

      const path = `/community/community-display-pictures/${newPictureName}`
      const relativePath = `public${path}`
      await writeFile(relativePath, buffer)

      newCommunity.picture = path
    }

    newCommunity.participants.push(user.id)
    const community = await Communities.create(newCommunity)

    return _serverActionDataAdapter(community)
  } catch (error) {
    console.error('Error when creating community: ', error)
  }
}