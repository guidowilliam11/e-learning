"use client"

import { FaDoorOpen, FaUserGroup, FaFloppyDisk, FaArrowLeft } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useConversationContext } from "@/contexts/conversationContext"
import { useEffect, useMemo, useRef, useState } from "react"
import { editCommunity, getCommunity, leaveCommunity } from "./actions"
import { getSession } from "next-auth/react"
import { toast } from "react-toastify"

const CommunityPage = () => {

  const { 
    activeCommunityProfileId,
    setActiveCommunityProfileId,
    setActivePeerProfileId,
    setActiveConversation
  } = useConversationContext()

  const router = useRouter()
  const [prevCommunity, setPrevCommunity] = useState({})
  const [community, setCommunity] = useState({})
  const [userId, setUserId] = useState('')
  const members = useMemo(() => community?.participants?.filter(participant => participant._id !== userId) || [])
  const picturePreview = useMemo(() => {
    if (!community.picture || typeof community.picture === 'string') {
      return ''
    }
    return URL.createObjectURL(community.picture)
  }, [community])
  const isCommunityEdited = useMemo(() => prevCommunity != community, [prevCommunity, community])

  const fallbackPicture = prevCommunity.picture || "/images/default-community-picture.png"

  const handleSuccessGetCommunity = res => {
    setPrevCommunity(res.body)
    setCommunity(res.body)
  }
  const handleClickBack = () => {
    setActiveCommunityProfileId('')
    router.back()
  }
  const handleLeaveCommunity = () => {
    leaveCommunity(activeCommunityProfileId)
      .then(handleSuccessLeaveCommunity)
  }
  const handleSuccessLeaveCommunity = () => {
    setActiveConversation({})
    setTimeout(() => router.push('/contact'), 1000)
    toast.success('You have left the community.')
  }
  const handleClickSave = () => {
    const formData = new FormData(editCommunityForm)

    formData.set('picture', community.picture)

    editCommunity(formData)
      .then(handleSuccessSave)
  }
  const handleSuccessSave = (res) => {
    if (res.body._id) {
      toast.success('Community has been edited.')
    }
  }
  const handlePictureChange = (e) => {
    if (e.target.files.length > 0) {
      setCommunity({...community, picture: e.target.files[0]})
    }
  }
  const handleClickMember = (member) => {
    setActivePeerProfileId(member._id)
    router.push(`/contact/peer`)
  }

  useEffect(() => {
    if (!activeCommunityProfileId) {
      router.back()
    }
    getSession()
      .then(({user}) => setUserId(user.id))
    getCommunity(activeCommunityProfileId)
      .then(handleSuccessGetCommunity)
  }, [])

  return (
    <section className="p-6 flex flex-grow h-full flex-col overflow-y-auto">
      <div
        className="flex bg-neutral-50 rounded-md drop-shadow-md items-center p-4 text-lg font-bold text-primary mb-4 justify-between"
      >
        <div className="flex items-center gap-4">
          <button onClick={handleClickBack}>
            <FaArrowLeft />
          </button>
          <span className="cursor-default">
            Community
          </span>
        </div>
        <div className="flex items-center gap-5">
          {
            isCommunityEdited &&
            <button
              className="text-secondary"
              onClick={handleClickSave}
            >
              <FaFloppyDisk/>
            </button>
          }
          <button
            className="text-primaryDark"
            onClick={handleLeaveCommunity}
          >
            <FaDoorOpen/>
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-neutral-50 rounded-md drop-shadow-md justify-center p-4 mb-4">
        <form className="flex items-center flex-col" id="editCommunityForm">
          <input type="text" name="communityId" id="" defaultValue={community?._id} hidden />
          <label htmlFor="imageInput">
            <Image
              src={picturePreview || fallbackPicture}
              width={175}
              height={175}
              alt={community.name || "Community"}
              className="rounded-full mb-3 drop-shadow-lg cursor-pointer"
              title="Click to upload a new picture"
            />
          </label>
          <input
            name="picture"
            type="file" id="imageInput" hidden
            accept=".png,.jpeg,.jpg"
            onChange={handlePictureChange}
          />
          <input 
            className="text-3xl font-bold text-primary mb-2 text-center bg-neutral-50 focus:outline-none border-primary focus:border-b-2"
            name="name"
            value={community.name || 'Name'}
            onChange={e => setCommunity({...community, name: e.target.value})}
          />
          <textarea
            className="text-lg font-semibold text-neutral-600 w-[75%] break-all text-center resize-none bg-neutral-50 focus:outline-none border-neutral-600 focus:border-b-2"
            name="description"
            value={community.description || 'Description'}
            onChange={e => setCommunity({...community, description: e.target.value})}
            placeholder="Describe this community"
          />
        </form>
      </div>
      <div className="flex flex-col bg-neutral-50 rounded-md drop-shadow-md overflow-auto min-h-[50vh]">
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
          members.map(member => (
            <div
              className="p-5 border-b-[1px] border-neutral-300 flex gap-4 cursor-pointer bg-neutral-50 hover:bg-neutral-200 transition duration-300"
              key={member._id}
              onClick={() => handleClickMember(member)}
            >
              <div>
                <Image
                  src={member.picture || '/images/default-profile-picture.webp'}
                  className="rounded-full"
                  height={48}
                  width={48}
                  alt="profile-picture"
                />
              </div>
              <div className="flex flex-grow items-start justify-between flex-col">
                <div className="font-semibold text-md line-clamp-2">
                  {member.fullName}
                </div>
                <div className="text-sm line-clamp-2">
                  {member.email}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </section>
)
}

export default CommunityPage