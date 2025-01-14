import { formatMessageTime } from "@/utils/time"
import { useEffect, useRef, useState } from "react"
import { useConversationContext } from "@/contexts/conversationContext"
import { validateMessages } from "../actions"
import Spinner from "@/components/Spinner"
import { FaFile } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import Image from "next/image"

const ConversationContent = ({ userId }) => {
  const router = useRouter()
  const {
    activeConversationId,
    activeConversationMessages,
    conversationsData,
    setConversationsData,
    setActiveConversationMessages,
  } = useConversationContext()

  const conversationPane = useRef(null)

  const [isFetchingConversationMessages, setIsFetchingConversationMessages] =
    useState(false)

  const handleClickSender = (sender) => {
    router.push(`/contact/peer?email=${sender.email}`)
  }
  const handleSuccessValidateMessages = (res) => {
    setActiveConversationMessages(res.body)
    const tempConversationsData = new Map(conversationsData)
    const tempSeenBy =
      tempConversationsData.get(activeConversationId).lastMessage?.seenBy
    if (tempSeenBy) {
      tempSeenBy.indexOf(userId) === -1 && tempSeenBy.push(userId)
    }
    setConversationsData(tempConversationsData)
  }

  useEffect(() => {
    conversationPane.current.scrollTop = conversationPane.current.scrollHeight
  }, [activeConversationMessages])

  useEffect(() => {
    setIsFetchingConversationMessages(true)
    validateMessages(activeConversationId)
      .then(handleSuccessValidateMessages)
      .finally(() => setIsFetchingConversationMessages(false))
  }, [activeConversationId])

  useEffect(() => {
    const lastMessage =
      activeConversationMessages[activeConversationMessages.length - 1]
    const lastMessageFromConversationsData =
      conversationsData.get(activeConversationId).lastMessage

    if (lastMessage?._id === lastMessageFromConversationsData?._id) {
      return
    }
    setActiveConversationMessages((prev) => [
      ...prev,
      lastMessageFromConversationsData,
    ])
  }, [conversationsData])

  return (
    <section
      ref={conversationPane}
      className="bg-secondaryLight flex flex-col flex-[6] overflow-y-auto px-5 py-5"
    >
      {isFetchingConversationMessages && (
        <div className="flex h-full flex-grow justify-center items-center">
          <Spinner className="h-1/3 w-1/3" />
        </div>
      )}
      {!isFetchingConversationMessages &&
        activeConversationMessages.length === 0 && (
          <div className="flex h-full flex-grow justify-center items-center text-xl">
            Be the first one to chat!
          </div>
        )}
      {!isFetchingConversationMessages &&
        activeConversationMessages.length > 0 &&
        activeConversationMessages.map((message) => {
          const {
            _id,
            sender,
            text,
            createdAt,
            conversationType,
            file,
            fileName,
          } = message
          const isSentByStudent = sender._id === userId
          return (
            <div key={_id} className="flex gap-2">
              {!isSentByStudent && (
                <div className="justify-start">
                  <Image
                    src={
                      sender?.picture || "/images/default-profile-picture.webp"
                    }
                    alt={sender?.name || "Picture"}
                    width={24}
                    height={24}
                    className="rounded-full max-h-[24px] max-w-[24px]"
                  />
                </div>
              )}
              <div
                className={
                  "flex w-full flex-col justify-center mb-5 " +
                  (isSentByStudent ? "items-end " : "items-start ")
                }
              >
                <button
                  onClick={() => handleClickSender(sender)}
                  className="truncate max-w-1/2"
                >
                  {conversationType === "communities" &&
                    !isSentByStudent &&
                    sender.fullName}
                </button>
                <div
                  className={
                    "p-4 max-w-[70%] mt-1 rounded-lg " +
                    (isSentByStudent
                      ? "bg-secondary text-neutral-50"
                      : "bg-neutral-50 text-neutral-950")
                  }
                >
                  {file && (
                    <a
                      className={
                        "cursor pointer p-2 border-[1px] rounded-md flex gap-2 items-center hover:bg-neutral-50/25 transition " +
                        (text && "mb-2 ") +
                        (isSentByStudent
                          ? "hover:bg-neutral-50/25"
                          : "hover:bg-neutral-400/25 border-neutral-950")
                      }
                      target="_blank"
                      href={file}
                    >
                      <FaFile className="flex-shrink-0" />
                      <span className="truncate">{fileName}</span>
                    </a>
                  )}
                  <div className="break-words text-pretty">{text}</div>
                </div>
                <div>{formatMessageTime(createdAt, true)}</div>
              </div>
            </div>
          )
        })}
    </section>
  )
}

export default ConversationContent
