import Image from "next/image";
import {FaArrowLeft, FaPhone} from "react-icons/fa6"
import {useConversationContext} from "@/contexts/conversationContext";
import {useRouter} from "next/navigation";

const ConversationHeader = () => {

  const router = useRouter()

  const {
    activeConversationId,
    activeConversation,
    setActiveConversationId,
    setActiveContactId
  } = useConversationContext()

  const {
    profilePicture,
    name,
    isCommunity
  } = activeConversation;

  const handleBackButtonClick = () => {
    setActiveConversationId(null)
  }

  const handleProfileClick = () => {
    setActiveContactId(activeConversationId)
    if (isCommunity) {
      router.push(`/contact/community`)
      return
    }
    router.push(`/contact/peer`)
  }

  const initiateCall = () => {
    let popup = null
    popup = window.open(
      `/call/${activeConversationId}`,
      '_blank',
      'menubar=no,status=no,width=1280'
    )
  }

  return (
    <section className="flex items-center justify-between px-7 flex-[1] rounded-md drop-shadow-md bg-neutral-50">
      <div className="flex flex-grow items-center">
        <div
          className="text-secondary font-semibold text-xl cursor-pointer"
          onClick={handleBackButtonClick}
        >
          <FaArrowLeft/>
        </div>
        <Image
          src={profilePicture || '/images/default-profile-picture.webp'}
          height={48}
          width={48}
          alt="Profile picture"
          className="rounded-full mx-3 cursor-pointer"
          onClick={handleProfileClick}
        />
        <div
          className="font-semibold text-lg cursor-pointer line-clamp-1"
          onClick={handleProfileClick}
        >
          {name}
        </div>
      </div>
      <div className="flex items-center gap-5 text-secondary font-semibold text-2xl">
        <FaPhone
          className="cursor-pointer"
          onClick={initiateCall}
        />
      </div>
    </section>
  )
}

export default ConversationHeader