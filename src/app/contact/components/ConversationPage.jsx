import { useConversationContext } from '@/contexts/conversationContext'
import { FaComments, FaUser, FaUsers } from 'react-icons/fa6'
import ConversationHeader from '@/app/contact/components/ConversationHeader'
import ConversationContent from '@/app/contact/components/ConversationContent'
import ConversationFooter from '@/app/contact/components/ConversationFooter'

const ConversationPage = ({ activeContactTab, peers, communities, userId }) => {
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
            {activeContactTab === 0 &&
              (peers?.length === 0 ? (
                <>
                  <div className="text-[8rem] mb-2">
                    <FaUser />
                  </div>
                  <div className="text-center">
                    No peers yet.. <br />
                    Add a new one!
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[8rem]">
                    <FaComments />
                  </div>
                  <span>Click on a conversation to open it</span>
                </>
              ))}
            {activeContactTab === 1 &&
              (communities?.length === 0 ? (
                <>
                  <div className="text-[8rem] mb-2">
                    <FaUsers />
                  </div>
                  <div className="text-center">
                    No communities yet.. <br />
                    Create a new one!
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[8rem]">
                    <FaComments />
                  </div>
                  <span>Click on a conversation to open it</span>
                </>
              ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ConversationPage
