import { FaPlus } from 'react-icons/fa6'
import { HiOutlinePaperAirplane } from 'react-icons/hi2'
import { useConversationContext } from '@/contexts/conversationContext'
import { useRef, useState } from 'react'
import Spinner from '@/components/Spinner'
import { postMessage } from '../actions'
import { toast } from 'react-toastify'

const ConversationFooter = ({ userId }) => {
  const {
    activeConversationId,
    activeConversation,
    conversationsData,
    setConversationsData,
  } = useConversationContext()

  const messageInput = useRef(null)
  const fileInput = useRef(null)
  const [fileInputState, setFileInputState] = useState(null)

  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      if (e.target.files[0].size > 10000000) {
        toast.error('File size cannot exceed 10 MB!')
        fileInput.current.value = ''
        return
      }
      setFileInputState(e.target.files[0])
      return
    }
  }

  const handleClearFileInput = () => {
    fileInput.current.value = ''
    setFileInputState(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const messageText = messageInput.current.value

    if (!messageText && !fileInputState) {
      return
    }

    const formData = new FormData(messageInputForm)
    formData.set('file', fileInputState)

    setIsSendingMessage(true)
    postMessage(formData)
      .then(handleSuccessPostMessage)
      .catch(handleFailPostMessage)
      .finally(() => setIsSendingMessage(false))
  }

  const handleSuccessPostMessage = (res) => {
    const conversation = res.body
    const tempConversationsData = new Map(conversationsData)
    tempConversationsData.set(conversation._id, {
      ...conversation,
      type: conversationsData.get(conversation._id).type,
    })
    setConversationsData(tempConversationsData)
    messageInput.current.value = ''
    fileInput.current.value = ''
    setFileInputState(null)
  }

  const handleFailPostMessage = () => {
    toast.error('Oops, something went wrong. Please try that again.')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between px-7 flex-[1] rounded-md drop-shadow-md bg-neutral-50 gap-4 relative"
      id="messageInputForm"
    >
      {fileInputState && (
        <div className="flex absolute bottom-[70%] bg-neutral-50 p-2 rounded-md gap-2">
          <div className="truncate max-w-full">{fileInputState.name}</div>
          <button onClick={handleClearFileInput}>X</button>
        </div>
      )}
      <input
        type="text"
        name="conversationId"
        defaultValue={activeConversationId}
        key={activeConversationId}
        hidden
      />
      <input
        type="text"
        name="conversationType"
        defaultValue={
          activeConversation.type === 'peer' ? 'peers' : 'communities'
        }
        key={activeConversation.type}
        hidden
      />
      <input
        type="file"
        name="file"
        ref={fileInput}
        onChange={handleFileChange}
        id="fileInput"
        disabled={isSendingMessage}
        hidden
      />
      <textarea
        placeholder="Type your message"
        className="flex flex-grow focus:outline-none p-3 resize-none bg-neutral-50"
        rows="1"
        name="text"
        ref={messageInput}
        disabled={isSendingMessage}
      />
      <div className="flex items-center gap-4 text-secondary font-semibold text-lg">
        <label className="cursor-pointer" htmlFor="fileInput">
          <FaPlus />
        </label>
        {isSendingMessage ? (
          <Spinner className="w-[18px]" />
        ) : (
          <button
            type="submit"
            className="cursor-pointer"
            disabled={isSendingMessage}
          >
            <HiOutlinePaperAirplane />
          </button>
        )}
      </div>
    </form>
  )
}

export default ConversationFooter
