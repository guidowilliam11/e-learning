'use client'

import ConversationPage from '@/app/contact/components/ConversationPage'
import { useEffect, useMemo, useRef, useState } from 'react'
import Conversation from '@/app/contact/components/Conversation'
import { FaUser, FaUserGroup } from 'react-icons/fa6'
import { getContacts } from './actions'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { useConversationContext } from '@/contexts/conversationContext'
import { redirect } from 'next/navigation'
import { useFullscreenLoadingContext } from '@/contexts/fullscreenLoadingContext'
import { classifyConversationsData } from '@/utils/conversationHelper'
import { pusherClient } from '@/libs/pusher/pusherClient'
import { pusherConfigs } from '@/configs/pusherConfigs'

const contactTabs = [
  {
    name: 'Direct',
    value: 'peer',
  },
  {
    name: 'Groups',
    value: 'community',
  },
]

const { channelName, event } = pusherConfigs

const ContactPage = () => {
  const { setIsFullscreenLoading } = useFullscreenLoadingContext()
  const {
    conversationsData,
    setConversationsData,
    activeContactTab,
    setActiveContactTab,
  } = useConversationContext()

  const [userId, setUserId] = useState('')
  const refUserId = useRef('')

  const peers = useMemo(() => {
    return classifyConversationsData(conversationsData, 'peer')
  }, [conversationsData])

  const communities = useMemo(() => {
    return classifyConversationsData(conversationsData, 'community')
  }, [conversationsData])

  const handleGetContactResult = (res) => {
    const { peers, communities } = res.body

    const tempConversationsData = new Map()
    peers.forEach((peer) => {
      tempConversationsData.set(peer._id, {
        ...peer,
        type: 'peer',
      })
    })
    communities.forEach((community) => {
      tempConversationsData.set(community._id, {
        ...community,
        type: 'community',
      })
    })
    setConversationsData(tempConversationsData)
  }

  const handlePusherContactUpdate = (data) => {
    let isMessageForStudent = false
    for (const participant of data.participants) {
      if (participant._id === refUserId.current) {
        isMessageForStudent = true
      }
    }
    if (!isMessageForStudent) {
      return
    }
    setConversationsData((prev) => {
      const newConversationsData = new Map(prev)
      newConversationsData.set(data._id, data)
      return newConversationsData
    })
  }

  useEffect(() => {
    setIsFullscreenLoading(true)
    getSession().then((session) => {
      !session && redirect('/login')
      const { user } = session
      setUserId(user.id)
      refUserId.current = user.id
      pusherClient.subscribe(channelName.contact)
      pusherClient.bind(event.contactUpdate, handlePusherContactUpdate)
      getContacts()
        .then(handleGetContactResult)
        .finally(() => setIsFullscreenLoading(false))
    })
    return () => {
      pusherClient.unsubscribe(channelName.contact)
    }
  }, [])

  const list = activeContactTab === 0 ? peers : communities

  return (
    <div className="contact grid grid-cols-[340px_minmax(0,1fr)] h-[calc(100vh-128px)] overflow-hidden bg-white border rounded-card border-line">
      <div className="flex flex-col min-h-0 border-r border-line">
        <div className="p-4 border-b border-line">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Link
              href={activeContactTab === 0 ? '/contact/peer/add' : '/contact/community/add'}
              className="flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-md border border-line hover:bg-page"
            >
              {activeContactTab === 0 ? <FaUser size={12} /> : <FaUserGroup size={13} />}
              {activeContactTab === 0 ? 'Add peer' : 'New group'}
            </Link>
          </div>
          <div role="tablist" aria-label="Conversation type" className="grid grid-cols-2 p-1 mt-3 rounded-lg bg-page">
            {contactTabs.map((tab, i) => (
              <button key={tab.value} role="tab" aria-selected={activeContactTab === i} onClick={() => setActiveContactTab(i)}
                className={`py-1.5 text-sm font-medium rounded-md ${activeContactTab === i ? 'bg-white shadow-sm text-ink' : 'text-ink-2 hover:text-ink'}`}>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {list.map((conversation) => (
            <Conversation key={conversation._id} conversation={{ ...conversation, userId }} />
          ))}
        </div>
      </div>
      <ConversationPage
        activeContactTab={activeContactTab}
        peers={peers}
        communities={communities}
        userId={userId}
      />
    </div>
  )
}

export default ContactPage
