import { formatMessageTime } from "@/utils/time"
import { useEffect, useRef, useState } from "react"
import { useConversationContext } from "@/contexts/conversationContext"
import { validateMessages } from "../actions"
import Spinner from "@/components/Spinner"
import { FaFile } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import Avatar from "@/components/Avatar"

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
      className="flex flex-col flex-1 min-h-0 px-6 py-5 overflow-y-auto bg-page/50"
    >
      {isFetchingConversationMessages && (
        <div className="flex h-full flex-grow justify-center items-center">
          <Spinner className="h-1/3 w-1/3" />
        </div>
      )}
      {!isFetchingConversationMessages &&
        activeConversationMessages.length === 0 && (
          <div className="flex h-full flex-grow justify-center items-center text-xl">
            No messages yet. Say hello.
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
                <Avatar name={sender?.fullName} src={sender?.picture} size={28} className="mt-1" />
              )}
              <div
                className={
                  "flex w-full flex-col justify-center mb-4 " +
                  (isSentByStudent ? "items-end " : "items-start ")
                }
              >
                <button
                  onClick={() => handleClickSender(sender)}
                  className="mb-1 text-xs font-medium truncate max-w-1/2 text-ink-2 hover:underline"
                >
                  {conversationType === "communities" &&
                    !isSentByStudent &&
                    sender.fullName}
                </button>
                <div
                  className={
                    "px-3.5 py-2.5 max-w-[65%] text-[15px] leading-relaxed rounded-2xl " +
                    (isSentByStudent
                      ? "bg-accent text-white rounded-br-md"
                      : "bg-white border border-line text-ink rounded-bl-md")
                  }
                >
                  {file && (
                    <a
                      className={
                        "cursor-pointer px-3 py-2 rounded-lg flex gap-2 items-center text-sm font-medium transition " +
                        (text && "mb-2 ") +
                        (isSentByStudent
                          ? "bg-white/15 hover:bg-white/25"
                          : "bg-page hover:bg-line")
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
                <div className="mt-1 text-[11px] text-ink-3 tnum">{formatMessageTime(createdAt, true)}</div>
              </div>
            </div>
          )
        })}
    </section>
  )
}

export default ConversationContent
