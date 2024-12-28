"use client"

import Link from "next/link";
import {FaArrowLeft, FaUserGroup, FaUser, FaUserPlus, FaUserMinus} from "react-icons/fa6";
import {useMemo, useState} from "react";
import {HiOutlinePaperAirplane} from "react-icons/hi2"
import Image from "next/image";
import './style.css';
import {contactsMockData, communitiesMockData} from "@/mock-data/contact";
import {useConversationContext} from "@/contexts/conversationContext";
import {useRouter} from "next/navigation";


const EditCommunityPage = () => {

  const router = useRouter();

  const [peers, setPeers] = useState([...contactsMockData.map(contact => ({...contact, selected: false }))]);
  const selectedPeers = useMemo(() => peers.filter(peer => peer.selected), [peers]);
  const [community, setCommunity] = useState({});
  const [communityName, setCommunityName] = useState("");

  useState(() => {

  })

  const handleClickBack = () => {
    router.back();
  }

  const editCommunity = () => {

  }

  const handleClickPeer = (peer) => {
    const nextPeers = peers
    const peerIndex = nextPeers.indexOf(peer)
    if (peerIndex > -1) {
      nextPeers[peerIndex].selected = !nextPeers[peerIndex].selected;
      setPeers([...nextPeers]);
    }
  }

  return (
    <section className="p-6 flex flex-grow h-full flex-col">
      <div className="flex gap-3 items-center text-primary font-bold text-xl mb-3">
        <button onClick={handleClickBack}>
          <FaArrowLeft/>
        </button>
        <span className="cursor-default">
          Edit Community
        </span>
      </div>
      <div className="flex w-full rounded-md drop-shadow-md items-center mt-3 mb-2">
        <form className="flex w-full gap-2 items-center mb-3" action={editCommunity}>
          <div
            className="rounded-full mr-4 image-upload-wrapper h-[100px] w-[100px] relative cursor-pointer"
          >
            <Image
              src={'/images/default-profile-picture.webp'}
              height={100}
              width={100}
              className="rounded-full"
              alt="profile-picture"
            />
            <div className="image-upload-overlay flex items-center justify-center rounded-full text-xs text-neutral-50">
              Upload Image
            </div>
          </div>
          <textarea
            required
            className="rounded drop-shadow-sm p-2 w-[30%] resize-none focus:outline-none focus:ring-primary focus:ring-2"
            placeholder="Community Name"
            value={communityName}
            onChange={e => setCommunityName(e.target.value)}
          />
          <button
            className="p-3 rounded-lg font-bold drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark transition duration-300"
            type="submit"
          >
            <HiOutlinePaperAirplane />
          </button>
        </form>
      </div>
      <div className="flex gap-5 overflow-auto">
        <div className="flex flex-col w-1/3 overflow-auto">
          <div
            className="flex justify-center items-center gap-1.5 border-b-[1px] border-neutral-300 bg-neutral-50 p-3 font-semibold text-neutral-600 sticky top-0"
          >
            <FaUserGroup/><span className="">Group Members</span>
          </div>
          <div
            className="p-5 border-b-[1px] border-neutral-300 flex gap-4 bg-neutral-50 transition duration-300"
          >
            <div>
              <Image
                src={'/images/default-profile-picture.webp'}
                className="rounded-full"
                height={48}
                width={48}
                alt="profile-picture"
              />
            </div>
            <div className="flex flex-grow items-center">
              <div className="font-semibold text-md line-clamp-2">You</div>
            </div>
          </div>
          {
            selectedPeers.map(peer => (
              <div
                className="p-5 border-b-[1px] border-neutral-300 flex gap-4 cursor-pointer hover:bg-gray-100 bg-neutral-50 transition duration-300"
                key={peer.id}
                onClick={() => handleClickPeer(peer)}
              >
                <div>
                  <Image
                    src={peer.profilePicture || '/images/default-profile-picture.webp'}
                    className="rounded-full"
                    height={48}
                    width={48}
                    alt="profile-picture"
                  />
                </div>
                <div className="flex flex-grow items-center justify-between">
                  <div className="font-semibold text-md line-clamp-2">
                    {peer.name}
                  </div>
                  <div className="font-semibold text-lg text-neutral-500">
                    <FaUserMinus />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="flex flex-col w-1/3 overflow-auto">
          <div
            className="flex justify-center items-center gap-1.5 border-b-[1px] border-neutral-300 bg-neutral-50 p-3 font-semibold text-neutral-600 sticky top-0"
          >
            <FaUser/><span className="">Select Peers</span>
          </div>
          {
            peers.map(peer => (
              <div
                className="p-5 border-b-[1px] border-neutral-300 flex gap-4 cursor-pointer hover:bg-gray-100 bg-neutral-50 transition duration-300"
                key={peer.id}
                onClick={() => handleClickPeer(peer)}
                style={peer.selected ? {display: "none"} : {display: "flex"} }
              >
                <div>
                  <Image
                    src={peer.profilePicture || '/images/default-profile-picture.webp'}
                    className="rounded-full"
                    height={48}
                    width={48}
                    alt="profile-picture"
                  />
                </div>
                <div className="flex flex-grow items-center justify-between">
                  <div className="font-semibold text-md line-clamp-2">
                    {peer.name}
                  </div>
                  <div className="font-semibold text-lg text-neutral-500">
                    <FaUserPlus />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default EditCommunityPage