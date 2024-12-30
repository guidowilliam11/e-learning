"use client"

import Link from "next/link";
import {FaArrowLeft, FaUserGroup, FaUser, FaUserPlus, FaUserMinus} from "react-icons/fa6";
import {useEffect, useMemo, useState} from "react";
import {HiOutlinePaperAirplane} from "react-icons/hi2"
import Image from "next/image";
import './style.css';
import {createCommunity, getPeers} from "@/app/contact/community/add/actions";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";
import { useFullscreenLoadingContext } from "@/contexts/fullscreenLoadingContext";
import { useConversationContext } from "@/contexts/conversationContext";

const AddCommunityPage = () => {

  const router = useRouter()

  const { setIsFullscreenLoading } = useFullscreenLoadingContext()
  const { setActivePeerProfileId } = useConversationContext()

  const [peers, setPeers] = useState([]);
  const selectedPeers = useMemo(() => peers.filter(peer => peer.selected), [peers]);
  const [communityName, setCommunityName] = useState("");
  const [picture, setPicture] = useState(null);
  const picturePreview = useMemo(() => {
    if (!picture) {
      return ''
    }
    return URL.createObjectURL(picture)
  }, [picture])

  const handleClickPeer = (peer) => {
    const nextPeers = peers
    const peerIndex = nextPeers.indexOf(peer)
    if (peerIndex > -1) {
      nextPeers[peerIndex].selected = !nextPeers[peerIndex].selected;
      setPeers([...nextPeers]);
    }
  }

  const handleClickPeerProfile = (peer) => {
    setActivePeerProfileId(peer._id)
    router.push('/contact/peer')
  }

  const handleGetPeerResult = (res) => {
    if (res.body.length === 0) {
      toast.error(`You don't have peers yet.`)
    }
    setPeers(res.body)
  }

  const handlePictureChange = (e) => {
    if (e.target.files.length > 0) {
      setPicture(e.target.files[0])
      return
    }
    setPicture(null)
  }

  const handleCreateCommunity = async (e) => {
    e.preventDefault()

    const formData = new FormData(createCommunityForm)

    formData.set('name', communityName)
    formData.set('participants', selectedPeers.map(peer => peer._id))
    formData.set('picture', picture)

    setIsFullscreenLoading(true)
    createCommunity(formData)
      .then(handleCreateCommunityResult)
      .finally(() => setIsFullscreenLoading(false))
  }

  const handleCreateCommunityResult = (res) => {
    if (res.body?._id) {
      setTimeout(() => router.push('/contact'), 1000)
      toast.success('Community has been created!')
    }
  }

  useEffect(() => {
    setIsFullscreenLoading(true)
    getPeers()
      .then(handleGetPeerResult)
      .finally(() => setIsFullscreenLoading(false))
  }, [])

  return (
    <section className="p-6 flex flex-grow h-full flex-col">
      <div className="flex gap-3 items-center text-primary font-bold text-xl mb-3">
        <Link href="/contact">
          <FaArrowLeft/>
        </Link>
        <span className="cursor-default">
          Create New Community
        </span>
      </div>
      <div className="flex w-full flex-col items-start mt-3 mb-5">
        <form className="flex w-full gap-2 items-center mb-1" onSubmit={handleCreateCommunity} id="createCommunityForm">
          <div
            className="rounded-full mr-4 image-upload-wrapper h-[100px] w-[100px] relative cursor-pointer"
          >
            <Image
              src={picturePreview || '/images/default-community-picture.png'}
              height={100}
              width={100}
              className="rounded-full"
              alt="profile-picture"
            />
            <label
              className="image-upload-overlay flex items-center justify-center rounded-full text-xs text-neutral-50"
              htmlFor="imageInput"
            >
              Upload Picture
            </label>
          </div>
          <input
            type="file" id="imageInput" style={{display: 'none'}}
            accept=".png,.jpeg,.jpg"
            onChange={handlePictureChange}
          />
          <textarea
            required
            name="name"
            value={communityName}
            className="rounded drop-shadow-sm p-2 w-[30%] resize-none focus:outline-none focus:ring-primary focus:ring-2"
            placeholder="Community Name"
            onChange={e => setCommunityName(e.target.value)}
          />
          <button
            className="p-3 rounded-lg font-bold drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark transition duration-300"
            type="submit"
          >
            <HiOutlinePaperAirplane />
          </button>
        </form>
        <div className="text-start text-neutral-500 text-sm">*Click on picture to upload</div>
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
                className="p-5 border-b-[1px] border-neutral-300 flex gap-4 cursor-pointer hover:bg-neutral-200 bg-neutral-50 transition duration-300"
                key={peer._id}
              >
                <div
                  onClick={() => handleClickPeerProfile(peer)}
                >
                  <Image
                    src={peer.picture || '/images/default-profile-picture.webp'}
                    className="rounded-full"
                    height={48}
                    width={48}
                    alt="profile-picture"
                  />
                </div>
                <div 
                  className="flex flex-grow items-center justify-between"
                  onClick={() => handleClickPeerProfile(peer)}
                >
                  <div className="font-semibold text-md line-clamp-2">
                    {peer.fullName}
                  </div>
                </div>
                <div
                  className="flex items-center font-semibold text-lg text-neutral-500 hover:scale-125 transition"
                  onClick={() => handleClickPeer(peer)}
                >
                  <FaUserMinus />
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
                className="p-5 border-b-[1px] border-neutral-300 flex gap-4 cursor-pointer hover:bg-neutral-200 bg-neutral-50 transition duration-300"
                key={peer._id}
                style={peer.selected ? {display: "none"} : {display: "flex"} }
              >
                <div
                  onClick={() => handleClickPeerProfile(peer)}
                >
                  <Image
                    src={peer.picture || '/images/default-profile-picture.webp'}
                    className="rounded-full"
                    height={48}
                    width={48}
                    alt="profile-picture"
                  />
                </div>
                <div
                  className="flex flex-grow items-center justify-between"
                  onClick={() => handleClickPeerProfile(peer)}
                >
                  <div className="font-semibold text-md line-clamp-2">
                    {peer.fullName}
                  </div>
                </div>
                <div
                  className="flex items-center font-semibold text-lg text-neutral-500 hover:scale-125 transition"
                  onClick={() => handleClickPeer(peer)}
                >
                  <FaUserPlus />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default AddCommunityPage