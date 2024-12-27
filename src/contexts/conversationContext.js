"use client"

import {createContext, useContext, useState} from "react"

const ConversationContext= createContext(null)

export const ConversationContextProvider = ({ children }) => {
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [conversationsData, setConversationsData] = useState(new Map());
    const [activeConversation, setActiveConversation] = useState({});
    const [isFetchingConversationData, setIsFetchingConversationData] = useState(true);
    const [activeContactId, setActiveContactId] = useState("");

    return <>
        <ConversationContext.Provider
            value={{
                activeConversationId,
                setActiveConversationId,
                isFetchingConversationData,
                setIsFetchingConversationData,
                conversationsData,
                setConversationsData,
                activeConversation,
                setActiveConversation,
                activeContactId,
                setActiveContactId
            }}
        >
            {children}
        </ConversationContext.Provider>
    </>
}

export const useConversationContext = () => {
    return useContext(ConversationContext)
}