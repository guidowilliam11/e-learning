"use client"

import {FaDoorOpen, FaUserGroup, FaPen, FaArrowLeft} from "react-icons/fa6";
import {useRouter} from "next/navigation";
import {communitiesMockData, contactsMockData} from "@/mock-data/contact";
import Image from "next/image";
import {useConversationContext} from "@/contexts/conversationContext";
import {useEffect, useMemo} from "react";

const CommunityPage = () => {

  const { activeContactId, setActiveContactId } = useConversationContext();

  const router = useRouter();
  const community  = {
    ...communitiesMockData.find(community => community.id === activeContactId)
  }
  const members = useMemo(() => [...contactsMockData], [contactsMockData]);

  useEffect(() => {
    if (!activeContactId) {
      router.push(`/contact`);
    }
  })

  const handleClickBack = () => {
    setActiveContactId('');
    router.push(`/contact`);
  }
  const handleClickEdit = () => {
    router.push(`/contact/community/edit`);
  }

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
          <button
            className="text-secondary"
            onClick={handleClickEdit}
          >
            <FaPen/>
          </button>
          <button
            className="text-primaryDark"
            onClick={() => router.back()}
          >
            <FaDoorOpen/>
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-neutral-50 rounded-md drop-shadow-md justify-center p-4 mb-4">
        <div className="flex items-center flex-col">
          <Image
            src={community.profilePicture || "/images/default-profile-picture.webp"}
            width={175}
            height={175}
            alt={community.name || "Community"}
            className="rounded-full mb-3 drop-shadow-lg"
          />
          <div className="text-3xl font-bold text-primary mb-2">
            {community.name}
          </div>
          <div className="text-lg font-semibold text-neutral-700 max-w-[50%] break-all text-center">
            {community.description}
          </div>
        </div>
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
              className="p-5 border-b-[1px] border-neutral-300 flex gap-4 cursor-pointer bg-neutral-50"
              key={member.id}
            >
              <div>
                <Image
                  src={member.profilePicture || '/images/default-profile-picture.webp'}
                  className="rounded-full"
                  height={48}
                  width={48}
                  alt="profile-picture"
                />
              </div>
              <div className="flex flex-grow items-center justify-between">
                <div className="font-semibold text-md line-clamp-2">
                  {member.name}
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