'use client'

import { useMemo } from 'react'
import { formatMessageTime } from '@/utils/time'
import { useConversationContext } from '@/contexts/conversationContext'
import Image from 'next/image'
import {
  profileConstructor,
  validateIsUnread,
} from '@/utils/conversationHelper'
import { FaPhone } from 'react-icons/fa6'

const UnreadCount = ({ userId, lastMessage, unreadCount }) => {
  let isUnread = validateIsUnread(userId, lastMessage)

  return (
    <>
      {isUnread && (
        <div
          className={
            'rounded-full bg-secondary w-fit px-2 text-neutral-50 text-xs font-semibold ' +
            (unreadCount ? 'py-1 ' : 'py-2')
          }
        >
          {unreadCount ? unreadCount : ' '}
        </div>
      )}
    </>
  )
}

const Conversation = ({ conversation }) => {
  const { setActiveConversationId } = useConversationContext()

  const { userId, unreadCount, lastMessage, onCall } = conversation

  const { displayedName, displayedPicture } = profileConstructor(
    conversation,
    userId
  )

  const displayedLastMessage = lastMessage?.fileName || lastMessage?.text

  const lastMessageTime = lastMessage?.createdAt
  const formattedLastMessageTime = useMemo(
    () => formatMessageTime(lastMessageTime),
    [conversation]
  )

  const handleClick = () => {
    setActiveConversationId(conversation._id)
  }

  return (
    <div
      className="p-5 border-b-[1px] border-neutral-300 flex gap-4 cursor-pointer hover:bg-neutral-200 transition duration-300"
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <Image
          src={displayedPicture}
          className="rounded-full"
          height={48}
          width={48}
          alt="profile-picture"
        />
      </div>
      <div className="flex flex-grow">
        <div className="flex flex-col w-4/5 justify-center">
          <div className="font-semibold text-md flex items-center gap-2">
            <span className="line-clamp-2 max-w-full break-all">
              {displayedName}
            </span>
            {onCall.length > 0 && (
              <FaPhone className="flex-shrink-0 text-primary animate-bounce" />
            )}
          </div>
          <div className="text-neutral-600 line-clamp-2 text-pretty break-all">
            {displayedLastMessage}
          </div>
        </div>
        <div className="flex flex-col w-1/5 gap-3 justify-start items-center">
          <div className="text-xs">{formattedLastMessageTime}</div>
          <UnreadCount
            userId={userId}
            lastMessage={lastMessage}
            unreadCount={unreadCount}
          />
        </div>
      </div>
    </div>
  )
}

export default Conversation
