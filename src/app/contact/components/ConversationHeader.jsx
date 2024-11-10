import Image from "next/image";
import { FaArrowLeft, FaPhone } from "react-icons/fa6"
import {useConversationContext} from "@/contexts/conversationContext";

const ConversationHeader = () => {

    const { activeConversation, setActiveConversationId } = useConversationContext()

    const {
        profilePicture,
        name
    } = activeConversation;

    const handleBackButtonClick = () => {
        setActiveConversationId(null)
    }

    return (
        <section className="flex items-center justify-between px-7 flex-[1] rounded-md drop-shadow-md bg-neutral-50">
            <div className="flex flex-grow items-center">
                <div
                    className="text-secondary font-semibold text-xl cursor-pointer"
                    onClick={handleBackButtonClick}
                >
                    <FaArrowLeft />
                </div>
                <Image
                    src={profilePicture || '/images/default-profile-picture.jpg'}
                    height={48}
                    width={48}
                    alt="Profile picture"
                    className="rounded-full mx-3 cursor-pointer"
                />
                <div className="font-semibold text-lg cursor-pointer line-clamp-1">
                    {name}
                </div>
            </div>
            <div className="flex items-center gap-5 text-secondary font-semibold text-2xl">
                <FaPhone
                    className="cursor-pointer"
                />
            </div>
        </section>
    )
}

export default ConversationHeader