"use client"

import {FaArrowLeft, FaBan} from "react-icons/fa6";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {useConversationContext} from "@/contexts/conversationContext";
import {useEffect, useState} from "react";
import {getPeerData} from "@/app/contact/peer/actions";
import { toast } from "react-toastify";

const PeerPage = () => {

  const { activePeerProfileId } = useConversationContext();

  const router = useRouter();
  const [peer, setPeerData]  = useState({})

  useEffect(() => {
    if (!activePeerProfileId) {
      router.push(`/contact`);
    }

    getPeerData(activePeerProfileId)
      .then(handlePeerData)
      .catch(handleFailGetPeerData)
  }, [activePeerProfileId])

  const handlePeerData = res => {
    setPeerData(res.body)
  }

  const handleFailGetPeerData = res => {
    toast.error('Oops, something went wrong. Please try that again.')
  }

  const handleClickBack = () => {
    router.back();
  }

  return (
    <section className="p-6 flex flex-grow h-full flex-col overflow-y-auto">
      <div className="flex bg-neutral-50 rounded-md drop-shadow-md items-center p-4 justify-between text-lg font-bold text-primary mb-4">
        <div className="flex items-center gap-4">
          <button onClick={handleClickBack}>
            <FaArrowLeft/>
          </button>
          <span className="cursor-default">
            Peer
          </span>
        </div>
        <div className="flex items-center gap-5">
          {/*TODO: Block*/}
          {/*<button*/}
          {/*  className="text-primaryDark"*/}
          {/*  onClick={() => router.back()}*/}
          {/*>*/}
          {/*  <FaBan />*/}
          {/*</button>*/}
        </div>
      </div>
      <div className="flex flex-col bg-neutral-50 rounded-md drop-shadow-md justify-center p-4">
        <div className="flex items-center flex-col">
          <Image
            src={peer.picture || "/images/default-profile-picture.webp"}
            width={175}
            height={175}
            alt={peer.name || "Peer"}
            className="rounded-full mb-3 drop-shadow-lg"
          />
          <div className="text-3xl font-bold text-primary mb-1">
            {peer.fullName}
          </div>
          <div className="text-md font-semibold text-neutral-600 max-w-[50%] break-all text-center mb-2">
            {peer.email}
          </div>
          <div className="text-lg font-semibold text-neutral-700 max-w-[50%] break-all text-center">
            {peer.description}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PeerPage