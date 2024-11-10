import {formatMessageTime} from "@/utils/time";
import {useEffect, useRef} from "react";
import {useConversationContext} from "@/contexts/conversationContext";

const ConversationContent = () => {

    const { activeConversation } = useConversationContext()

    const conversationPane = useRef(null)

    useEffect(() => {
        conversationPane.current.scrollTop = conversationPane.current.scrollHeight
    }, [activeConversation])

    return (
        <section ref={conversationPane} className="bg-secondaryLight flex flex-col flex-[6] overflow-y-auto px-5 py-5">
            {activeConversation.messages.map(message => {
                const {
                    id,
                    senderName,
                    value,
                    time
                } = message

                return <div
                    key={id}
                    className={
                        "flex flex-col-reverse justify-center mb-5 " +
                        (senderName ? "items-start " : "items-end ")
                    }
                >
                    <div>{formatMessageTime(time, true)}</div>
                    <div
                        className={
                            "p-4 max-w-[70%] mt-1 rounded-lg " +
                            (senderName ? "bg-neutral-50 text-neutral-950" : "bg-secondary text-neutral-50")
                        }
                    >
                        {value}
                    </div>
                    <div>
                        {activeConversation.isCommunity ? senderName : ""}
                    </div>
                </div>
            })}
        </section>
    )
}

export default ConversationContent