import { FaPlus } from "react-icons/fa6"
import { HiOutlinePaperAirplane  } from "react-icons/hi2"
import {useConversationContext} from "@/contexts/conversationContext";
import {useRef} from "react";

const ConversationFooter = () => {
    const {
        activeConversation,
        setActiveConversation,
        conversationsData,
        setConversationsData,
        activeConversationId
    } = useConversationContext()

    const messageInput = useRef(null)

    const handleSubmit = () => {
        const value = messageInput.current.value

        if (!value) {
            return
        }

        const newConversationData = {
            ...activeConversation,
            messages: [
                ...activeConversation.messages,
                {
                    id: crypto.randomUUID(),
                    senderName: '',
                    type: 'text',
                    isCommunity: activeConversation.isCommunity,
                    value,
                    time: new Date(),
                    link: ''
                }
            ]
        }

        setActiveConversation(newConversationData)
        conversationsData.set(activeConversationId, newConversationData)
        setConversationsData(conversationsData)
        localStorage.setItem(`conversation-${activeConversationId}`, JSON.stringify(newConversationData))
        messageInput.current.value = ''
    }

    return (
        <form
            action={handleSubmit}
            className="flex items-center justify-between px-7 flex-[1] rounded-md drop-shadow-md bg-neutral-50 gap-4"
        >
            <textarea
                placeholder="Type your message"
                className="flex flex-grow focus:outline-none p-3 resize-none"
                rows="1"
                ref={messageInput}
            />
            <div className="flex items-center gap-4 text-secondary font-semibold text-lg">
                <button>
                    <FaPlus />
                </button>
                <button
                    type="submit"
                >
                    <HiOutlinePaperAirplane  />
                </button>
            </div>
        </form>
    )
}

export default ConversationFooter