import { useConversationContext } from "@/contexts/conversationContext";
import { FaComments } from 'react-icons/fa6'
import ConversationHeader from '@/app/contact/components/ConversationHeader'
import ConversationContent from "@/app/contact/components/ConversationContent";
import ConversationFooter from "@/app/contact/components/ConversationFooter";

const ConversationPage = () => {
    const { activeConversationId, isFetchingConversationData } = useConversationContext()

    return <>
        <div className="flex flex-col bg-neutral-50 rounded-md drop-shadow-md overflow-y-auto">
            {activeConversationId ?
                isFetchingConversationData ?
                    <>Loading</>
                    :
                    <>
                        <ConversationHeader/>
                        <ConversationContent/>
                        <ConversationFooter/>
                    </>
                :
                <div className="flex flex-col justify-center items-center h-full font-semibold text-neutral-600 text-lg">
                    <div className="text-[8rem]">
                        <FaComments />
                    </div>
                    <span>Click on a conversation to open it</span>
                </div>
            }
        </div>
    </>
}

export default ConversationPage