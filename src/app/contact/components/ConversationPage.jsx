import { useConversationContext } from "@/contexts/conversationContext"
import { FaComments } from "react-icons/fa6"
import ConversationHeader from "@/app/contact/components/ConversationHeader"
import ConversationContent from "@/app/contact/components/ConversationContent"
import ConversationFooter from "@/app/contact/components/ConversationFooter"

const ConversationPage = ({ userId }) => {
  const { activeConversationId } = useConversationContext()

  return (
    <>
      <div className="flex flex-col h-full bg-neutral-50 rounded-md drop-shadow-md overflow-y-auto">
        {activeConversationId ? (
          <>
            <ConversationHeader userId={userId} />
            <ConversationContent userId={userId} />
            <ConversationFooter userId={userId} />
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full font-semibold text-neutral-600 text-lg">
            <div className="text-[8rem]">
              <FaComments />
            </div>
            <span>Click on a conversation to open it</span>
          </div>
        )}
      </div>
    </>
  )
}

export default ConversationPage
