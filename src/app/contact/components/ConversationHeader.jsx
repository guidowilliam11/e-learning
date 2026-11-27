import Avatar from '@/components/Avatar'
import { FaXmark, FaPhone } from 'react-icons/fa6'
import { useConversationContext } from '@/contexts/conversationContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { validateRoomData } from '@/app/call/[id]/actions'
import { profileConstructor } from '@/utils/conversationHelper'

const ConversationHeader = ({ userId }) => {
  const router = useRouter()

  const {
    activeConversation,
    setActiveConversationId,
    isCallOngoing,
    setIsCallOngoing,
  } = useConversationContext()

  const { type, onCall } = activeConversation
  const { displayedName, displayedPicture, peer } = profileConstructor(
    activeConversation,
    userId
  )

  const handleBackButtonClick = () => {
    setActiveConversationId(null)
  }

  const handleProfileClick = () => {
    if (type === 'peer') {
      router.push(`/contact/peer?email=${peer.email}`)
      return
    }
    router.push(`/contact/community?communityId=${activeConversation._id}`)
  }

  const initiateCall = () => {
    if (isCallOngoing) {
      toast.error('You must leave the other call first.')
      return
    }
    setIsCallOngoing(true)
    let popup = null
    popup = window.open(
      `/call/${activeConversation._id}?type=${type}`,
      '_blank',
      'menubar=no,status=no,width=1280'
    )
    popup.onpagehide = (e) => {
      if (e?.timeStamp < 1000) {
        return
      }
      validateRoomData(type, activeConversation._id)
      setIsCallOngoing(false)
    }
  }

  return (
    <section className="flex items-center justify-between h-16 px-5 border-b border-line shrink-0">
      <button className="flex items-center min-w-0 gap-3 text-left" onClick={handleProfileClick}>
        <Avatar name={displayedName} src={displayedPicture} size={36} group={type === 'community'} />
        <span className="min-w-0">
          <span className="block font-semibold truncate">{displayedName}</span>
          <span className="block text-xs text-ink-3">{type === 'community' ? `${activeConversation.participants?.length || 0} members` : 'Direct message'}</span>
        </span>
      </button>
      <div className="flex items-center gap-1">
        <button
          onClick={initiateCall}
          aria-label={onCall.length > 0 ? 'Join the call' : 'Start a video call'}
          className={`flex items-center gap-2 h-9 px-3 text-sm font-medium rounded-md ${onCall.length > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border border-line hover:bg-page'}`}
        >
          <FaPhone size={13} /> {onCall.length > 0 ? 'Join call' : 'Call'}
        </button>
        <button onClick={handleBackButtonClick} aria-label="Close conversation" className="grid rounded-md size-9 place-items-center text-ink-3 hover:bg-page hover:text-ink">
          <FaXmark size={15} />
        </button>
      </div>
    </section>
  )
}

export default ConversationHeader
