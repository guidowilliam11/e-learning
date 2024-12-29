"use client"

import { createContext, useContext, useState } from "react"

const ConversationContext = createContext(null)

export const ConversationContextProvider = ({ children }) => {
    const [activeContactTab, setActiveContactTab] = useState(0);
    const [conversationsData, setConversationsData] = useState(new Map());
    const [activeConversation, setActiveConversation] = useState({});
    const [activeConversationMessages, setActiveConversationMessages] = useState({});
    const [isFetchingConversationData, setIsFetchingConversationData] = useState(false);
    const [activePeerProfileId, setActivePeerProfileId] = useState('');
    const [activeCommunityProfileId, setActiveCommunityProfileId] = useState('');
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
                activePeerProfileId,
                setActivePeerProfileId,
                activeCommunityProfileId,
                setActiveCommunityProfileId,
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