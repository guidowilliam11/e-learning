import Image from "next/image"
import { FaArrowLeft, FaPhone } from "react-icons/fa6"
import { useConversationContext } from "@/contexts/conversationContext"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { validateRoomData } from "@/app/call/[id]/actions"
import { profileConstructor } from "@/utils/conversationHelper"

const ConversationHeader = ({ userId }) => {
  const router = useRouter()

  const {
    activeConversation,
    setActiveConversationId,
    isCallOngoing,
    setIsCallOngoing,
  } = useConversationContext()

  const { type, onCall } = activeConversation
  const { displayedName, displayedPicture, peer } = profileConstructor(
    activeConversation,
    userId
  )

  const handleBackButtonClick = () => {
    setActiveConversationId(null)
  }

  const handleProfileClick = () => {
    if (type === "peer") {
      router.push(`/contact/peer?email=${peer.email}`)
      return
    }
    router.push(`/contact/community?communityId=${activeConversation._id}`)
  }

  const initiateCall = () => {
    setIsCallOngoing(true)
    if (!isCallOngoing) {
      let popup = null
      popup = window.open(
        `/call/${activeConversation._id}?type=${type}`,
        "_blank",
        "menubar=no,status=no,width=1280"
      )
      popup.onpagehide = (e) => {
        console.log(e)
        if (e?.timeStamp < 1000) {
          return
        }
        validateRoomData(type, activeConversation._id)
        setIsCallOngoing(false)
      }
      return
    }
    toast.error("You must leave the other call first.")
  }

  return (
    <section className="flex items-center justify-between px-7 flex-[1] rounded-md drop-shadow-md bg-neutral-50">
      <div className="flex flex-grow items-center">
        <div
          className="text-secondary font-semibold text-xl cursor-pointer"
          onClick={handleBackButtonClick}
        >
          <FaArrowLeft />
        </div>
        <Image
          src={displayedPicture || "/images/default-profile-picture.webp"}
          height={48}
          width={48}
          alt="Profile picture"
          className="rounded-full mx-3 cursor-pointer max-h-[48px] max-w-[48px]"
          onClick={handleProfileClick}
        />
        <div
          className="font-semibold text-lg cursor-pointer line-clamp-1"
          onClick={handleProfileClick}
        >
          {displayedName}
        </div>
      </div>
      <div
        className={
          "flex items-center gap-5 font-semibold text-2xl " +
          (onCall.length > 0 ? "text-primary animate-bounce" : "text-secondary")
        }
      >
        <FaPhone className="cursor-pointer" onClick={initiateCall} />
      </div>
    </section>
  )
}

export default ConversationHeader
