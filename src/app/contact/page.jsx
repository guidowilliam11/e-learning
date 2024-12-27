"use client"

import ContentNavigationBar from "@/components/ContentNavigationBar";
import ConversationPage from "@/app/contact/components/ConversationPage";
import { useState } from "react";
import Conversation from "@/app/contact/components/Conversation";
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { communitiesMockData, contactsMockData } from "@/mock-data/contact";
import Link from "next/link";

const contactTabs = [
  {
    name: "Private",
    value: "private"
  },
  {
    name: "Community",
    value: "community"
  }
]

const ContactPage = () => {

  const [activeContactTab, setActiveContactTab] = useState(0)

  return (
    <div className="contact h-[87.5%]">
      <ContentNavigationBar
        tabs={contactTabs}
        activeTab={activeContactTab}
        setActiveTab={setActiveContactTab}
      />
      <div className="grid grid-cols-contact gap-5 mt-5 h-full">
        <div className="bg-neutral-50 rounded-md drop-shadow-md overflow-y-auto h-fit max-h-full">
          {activeContactTab === 0 ?
            <>
              <Link
                className="flex justify-center items-center gap-1.5 border-b-[1px] border-neutral-300 bg-neutral-50 p-3 cursor-pointer font-semibold text-neutral-600 hover:bg-gray-100 sticky top-0"
                href="/contact/peer/add"
              >
                <FaUser /><span className="">New Contact</span>
              </Link>
              {
                contactsMockData.map(contact => (
                  <Conversation
                    key={contact.id}
                    conversation={contact}
                  />
                ))
              }
            </>
            :
            <>
              <Link
                className="flex justify-center items-center gap-1.5 border-b-[1px] border-neutral-300 bg-neutral-50 p-3 cursor-pointer font-semibold text-neutral-600 hover:bg-gray-100 sticky top-0"
                href="/contact/community/add"
              >
                <FaUserGroup /><span className="">New Community</span>
                {/* Should open settings page (?) */}
              </Link>
              {
                communitiesMockData.map(community => (
                  <Conversation
                    key={community.id}
                    conversation={community}
                  />
                ))
              }
            </>
          }
        </div>
        <ConversationPage />
      </div>
    </div>
  );
}

export default ContactPage