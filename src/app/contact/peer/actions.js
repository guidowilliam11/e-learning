"use server"

import {connectToDatabase} from "@/libs/mongo/config";
import {authServerSession} from "@/libs/auth/session";
import {redirect} from "next/navigation";
import Peers from "@/models/PeerModel";
import {_serverActionDataAdapter} from "@/utils/adapter";

export const getPeerData = async (targetStudentId) => {
  try {
    await connectToDatabase()
    const { user } = await authServerSession()

    const peer = await Peers.findOne({
      participants: {
        $in: user.id
      }
    }).findOne({
      participants: {
        $in: targetStudentId
      }
    }).populate('participants', 'fullName picture email')

    if (!peer) {
      redirect('/contact')
    }

    // Get target student
    const result = peer.participants.find(participant => !participant._id.equals(user.id))

    return _serverActionDataAdapter(result)

  } catch (error) {
    throw error
  }
}