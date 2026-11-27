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
      className="relative flex items-end gap-2 p-3 border-t border-line shrink-0"
      id="messageInputForm"
    >
      {fileInputState && (
        <div className="absolute flex items-center gap-2 px-3 py-1.5 text-sm bg-white border rounded-md shadow-sm bottom-full left-3 mb-2 border-line">
          <div className="truncate max-w-full">{fileInputState.name}</div>
          <button type="button" aria-label="Remove attachment" onClick={handleClearFileInput} className="text-ink-3 hover:text-ink">×</button>
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
        placeholder="Write a message"
        aria-label="Message"
        className="flex flex-grow px-3 py-2.5 text-sm border rounded-lg resize-none border-line focus:outline-none focus:border-accent"
        rows="1"
        name="text"
        ref={messageInput}
        disabled={isSendingMessage}
      />
      <div className="flex items-center gap-1">
        <label className="grid rounded-lg cursor-pointer size-10 place-items-center text-ink-2 hover:bg-page" htmlFor="fileInput" aria-label="Attach a file">
          <FaPlus />
        </label>
        {isSendingMessage ? (
          <Spinner className="w-[18px]" />
        ) : (
          <button
            type="submit"
            aria-label="Send"
            className="grid text-white rounded-lg size-10 place-items-center bg-accent hover:bg-accent-hover"
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
