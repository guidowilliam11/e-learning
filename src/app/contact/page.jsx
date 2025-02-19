'use client'

import ContentNavigationBar from '@/components/ContentNavigationBar'
import ConversationPage from '@/app/contact/components/ConversationPage'
import { useEffect, useMemo, useState } from 'react'
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
    name: 'Private',
    value: 'peer',
  },
  {
    name: 'Community',
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
      if (participant._id === userId) {
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

  return (
    <div className="contact flex h-full flex-col">
      <ContentNavigationBar
        tabs={contactTabs}
        activeTab={activeContactTab}
        setActiveTab={setActiveContactTab}
      />
      <div className="grid grid-cols-contact gap-5 mt-5 h-full max-h-[87.5%]">
        <div className="bg-neutral-50 rounded-md drop-shadow-md overflow-y-auto h-fit max-h-full">
          {activeContactTab === 0 ? (
            <>
              <Link
                className="flex justify-center items-center gap-1.5 border-b-[1px] border-neutral-300 bg-neutral-50 p-3 cursor-pointer font-semibold text-neutral-600 hover:bg-gray-100 sticky top-0"
                href="/contact/peer/add"
              >
                <FaUser />
                <span>Add Peer</span>
              </Link>
              {peers.map((peer) => (
                <Conversation
                  key={peer._id}
                  conversation={{
                    ...peer,
                    userId,
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <Link
                className="flex justify-center items-center gap-1.5 border-b-[1px] border-neutral-300 bg-neutral-50 p-3 cursor-pointer font-semibold text-neutral-600 hover:bg-gray-100 sticky top-0"
                href="/contact/community/add"
              >
                <FaUserGroup />
                <span className="">New Community</span>
              </Link>
              {communities.map((community) => (
                <Conversation
                  key={community._id}
                  conversation={{
                    ...community,
                    userId,
                  }}
                />
              ))}
            </>
          )}
        </div>
        <ConversationPage
          activeContactTab={activeContactTab}
          peers={peers}
          communities={communities}
          userId={userId}
        />
      </div>
    </div>
  )
}

export default ContactPage
