"use client"

import { createContext, useContext, useState } from "react"

const ConversationContext = createContext(null)

export const ConversationContextProvider = ({ children }) => {
    const [activeContactTab, setActiveContactTab] = useState(0);
    const [conversationsData, setConversationsData] = useState(new Map());
    const [activeConversation, setActiveConversation] = useState({});
    const [activeConversationMessages, setActiveConversationMessages] = useState({});
    const [isFetchingConversationData, setIsFetchingConversationData] = useState(false);
    const [isCallOngoing, setIsCallOngoing] = useState(false)

    return <>
        <ConversationContext.Provider
            value={{
                activeContactTab,
                setActiveContactTab,
                isFetchingConversationData,
                setIsFetchingConversationData,
                conversationsData,
                setConversationsData,
                activeConversation,
                setActiveConversation,
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