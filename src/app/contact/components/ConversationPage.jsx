import { useConversationContext } from '@/contexts/conversationContext'
import { FaComments, FaUser, FaUsers } from 'react-icons/fa6'
import ConversationHeader from '@/app/contact/components/ConversationHeader'
import ConversationContent from '@/app/contact/components/ConversationContent'
import ConversationFooter from '@/app/contact/components/ConversationFooter'

const ConversationPage = ({ activeContactTab, peers, communities, userId }) => {
  const { activeConversationId } = useConversationContext()

  return (
    <>
      <div className="flex flex-col min-h-0 h-full">
        {activeConversationId ? (
          <>
            <ConversationHeader userId={userId} />
            <ConversationContent userId={userId} />
            <ConversationFooter userId={userId} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-sm text-ink-3">
            {activeContactTab === 0 &&
              (peers?.length === 0 ? (
                <>
                  <div className="text-3xl mb-1 text-zinc-300">
                    <FaUser />
                  </div>
                  <div className="text-center">
                    No direct messages yet. Add a peer to start one.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-1 text-zinc-300">
                    <FaComments />
                  </div>
                  <span>Pick a conversation to read it</span>
                </>
              ))}
            {activeContactTab === 1 &&
              (communities?.length === 0 ? (
                <>
                  <div className="text-3xl mb-1 text-zinc-300">
                    <FaUsers />
                  </div>
                  <div className="text-center">
                    No groups yet. Create one for your class.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-1 text-zinc-300">
                    <FaComments />
                  </div>
                  <span>Pick a conversation to read it</span>
                </>
              ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ConversationPage
