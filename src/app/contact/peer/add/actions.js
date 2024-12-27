"use server";

import Students from "@/models/StudentModel";
import {authServerSession} from "@/libs/auth/session";
import Peers from "@/models/PeerModel";
import {connectToDatabase} from "@/libs/mongo/config";
import {_serverActionDataAdapter} from "@/utils/adapter";

export const searchPeer = async (email) => {
  try {
    await connectToDatabase()
    const { user } = await authServerSession()

    if (user.email === email) {
      return {
        error: 'YOURSELF'
      }
    }

    let alreadyPeers = false
    const searchedPeer = await Students.findOne({email: email})
    if (!searchedPeer) {
      return {
        error: 'NOT_FOUND'
      }
    }

    const existingPeer = await Peers.findOne({
      participants: {
        $in: user.id
      }
    }).findOne({
      participants: {
        $in: searchedPeer._id
      }
    })

    if (existingPeer) {
      alreadyPeers = true
    }

    return _serverActionDataAdapter({
      ...searchedPeer.toObject(),
      alreadyPeers
    })
  } catch (error) {
    throw error
  }
}

export const addPeer = async (targetPeer) => {
  try {
    const { user } = await authServerSession()

    const peer = await Peers.create({
      participants: [
        user.id,
        targetPeer._id
      ],
      lastMessage: null
    })

    return _serverActionDataAdapter(peer)

  } catch (error) {
    throw error
  }
}