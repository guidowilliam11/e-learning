"use client"

import { createContext, useContext, useMemo, useState } from "react"

const ConversationContext = createContext(null)

export const ConversationContextProvider = ({ children }) => {
  const [activeContactTab, setActiveContactTab] = useState(0)
  const [conversationsData, setConversationsData] = useState(new Map())
  const [activeConversationId, setActiveConversationId] = useState(null)
  const activeConversation = useMemo(() => activeConversationId ? conversationsData.get(activeConversationId) : {})
  const [activeConversationMessages, setActiveConversationMessages] = useState([])
  const [isCallOngoing, setIsCallOngoing] = useState(false)

  return <>
    <ConversationContext.Provider
      value={{
        activeContactTab,
        setActiveContactTab,
        conversationsData,
        setConversationsData,
        activeConversationId,
        setActiveConversationId,
        activeConversation,
        activeConversationMessages,
        setActiveConversationMessages,
        isCallOngoing,
        setIsCallOngoing
      }}
    >
      {children}
    </ConversationContext.Provider>
  </>
}

export const useConversationContext = () => {
  return useContext(ConversationContext)
}