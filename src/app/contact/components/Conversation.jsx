"use client"

import {useMemo, useState} from "react";
import {formatMessageTime} from "@/utils/time";
import {useConversationContext} from "@/contexts/conversationContext";
import Image from "next/image";
import {conversationsMockData} from "@/mock-data/contact";

const UnreadCount = ({isUnread, unreadCount}) => {
    return <>
        {isUnread && (
            <div className="rounded-full bg-secondary w-fit py-1 px-2 text-neutral-50 text-xs font-semibold">{unreadCount}</div>
        )}
    </>
}

const Conversation = ({
    conversation
}) => {

    const {
        setActiveConversationId,
        setIsFetchingConversationData,
        conversationsData,
        setConversationsData,
        setActiveConversation
    } = useConversationContext()

    const {
        id,
        name,
        profilePicture,
        lastMessage,
        lastMessageTime,
        unreadCount
    } = conversation

    const [isUnread, setIsUnread] = useState(unreadCount > 0)

    const formattedLastMessageTime = useMemo(() => formatMessageTime(lastMessageTime), [lastMessageTime])

    const handleClick = () => {
        setActiveConversationId(id)
        setIsFetchingConversationData(true)
        const savedConversation = JSON.parse(localStorage.getItem(`conversation-${id}`))
        if (savedConversation) {
            setActiveConversation(savedConversation)
        } else {
            const newActiveConversation = conversationsMockData.get(id)
            setActiveConversation(newActiveConversation)
            conversationsData.set(id, newActiveConversation)
            setConversationsData(conversationsData)
            localStorage.setItem(`conversation-${id}`, JSON.stringify(newActiveConversation))
        }
        setIsFetchingConversationData(false)
        setIsUnread(false)
    }

    return (
        <div className="p-5 border-b-[1px] border-neutral-300 flex gap-4 cursor-pointer hover:bg-gray-100 transition duration-300" onClick={handleClick}>
            <div>
                <Image
                    src={profilePicture || '/images/default-profile-picture.webp'}
                    className="rounded-full"
                    height={48}
                    width={48}
                    alt="profile-picture"
                />
            </div>
            <div className="flex flex-grow">
                <div className="flex flex-col w-4/5">
                    <div className="font-semibold text-md line-clamp-2">{name}</div>
                    <div className={isUnread ? "text-secondary" : ""}>{lastMessage}</div>
                </div>
                <div className="flex flex-col w-1/5 gap-3 justify-start items-center">
                    <div className="text-xs">{formattedLastMessageTime}</div>
                    <UnreadCount isUnread={isUnread} unreadCount={unreadCount} />
                </div>
            </div>
        </div>
    )
}

export default Conversation