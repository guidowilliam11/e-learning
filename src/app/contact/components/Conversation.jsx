"use client"

import { useMemo } from "react"
import { formatMessageTime } from "@/utils/time"
import { useConversationContext } from "@/contexts/conversationContext"
import Avatar from "@/components/Avatar"
import {
  profileConstructor,
  validateIsUnread,
} from "@/utils/conversationHelper"
import { FaPhone } from "react-icons/fa6"

const UnreadCount = ({ userId, lastMessage, unreadCount }) => {
  let isUnread = validateIsUnread(userId, lastMessage)

  return (
    <>
      {isUnread && (
        <div
          className={
            "rounded-full bg-accent min-w-5 h-5 px-1.5 grid place-items-center text-white text-[11px] font-semibold tnum"
          }
        >
          {unreadCount ? unreadCount : " "}
        </div>
      )}
    </>
  )
}

const Conversation = ({ conversation }) => {
  const { activeConversationId, setActiveConversationId } = useConversationContext()

  const { userId, unreadCount, lastMessage, onCall } = conversation

  const { displayedName, displayedPicture } = profileConstructor(
    conversation,
    userId
  )

  const displayedLastMessage = lastMessage?.fileName || lastMessage?.text

  const lastMessageTime = lastMessage?.createdAt
  const formattedLastMessageTime = useMemo(
    () => formatMessageTime(lastMessageTime),
    [lastMessageTime]
  )

  const handleClick = () => {
    setActiveConversationId(conversation._id)
  }

  const isActive = activeConversationId === conversation._id
  const unread = validateIsUnread(userId, lastMessage)
  const fromMe = lastMessage?.sender?._id === userId

  return (
    <button
      className={`w-full text-left px-4 py-3 flex gap-3 border-l-2 ${isActive ? "bg-accent-wash border-accent" : "border-transparent hover:bg-page"}`}
      onClick={handleClick}
      aria-current={isActive ? "true" : undefined}
    >
      <Avatar name={displayedName} src={displayedPicture} size={44} group={conversation.type === "community"} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className={`truncate text-sm ${unread ? "font-semibold" : "font-medium"}`}>{displayedName}</span>
          <span className={`text-xs shrink-0 tnum ${unread ? "text-accent font-medium" : "text-ink-3"}`}>{formattedLastMessageTime}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className={`truncate text-sm ${unread ? "text-ink" : "text-ink-3"}`}>
            {onCall.length > 0 ? <span className="inline-flex items-center gap-1 font-medium text-emerald-700"><FaPhone size={11} /> On a call</span> : <>{fromMe && "You: "}{displayedLastMessage}</>}
          </span>
          <UnreadCount userId={userId} lastMessage={lastMessage} unreadCount={unreadCount} />
        </div>
      </div>
    </button>
  )
}

export default Conversation
