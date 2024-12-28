"use client";

import Link from "next/link"
import {
  FaArrowLeft,
  FaMagnifyingGlass,
  FaHourglass,
  FaTriangleExclamation,
  FaPersonCircleQuestion
} from "react-icons/fa6"
import {useState} from "react";
import Image from "next/image";
import {addPeer, searchPeer} from "@/app/contact/peer/add/actions";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {useConversationContext} from "@/contexts/conversationContext";

const errorModeEnum = {
  notFound: "NOT_FOUND",
  yourself: "YOURSELF",
  serverError: "500"
}

const Result = ({ isLoading, result, errorMode }) => {

  const router = useRouter()
  const { setActiveContactId } = useConversationContext()

  const handleClickAdd = () => {
    addPeer(result)
      .then(handleAddResult)
      .catch(handleFailAddPeer)
  }

  const handleAddResult = (res) => {
    if (res.body._id) {
      setTimeout(() => router.push('/contact'), 1000)
      toast.success('Successfully added peer!')
    }
  }

  const handleFailAddPeer = (res) => {
    toast.error('Oops, something went wrong. Please try that again.')
  }

  const handleClickViewProfile = () => {
    setActiveContactId(result._id)
    router.push('/contact/peer')
  }

  switch (errorMode) {
    case errorModeEnum.notFound:
      return (
        <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
          <FaPersonCircleQuestion className="mb-4"/>
          <div className="text-lg">We searched high and low, but found no one...</div>
          <div className="text-lg">Make sure the email is correct</div>
        </div>
      )
    case errorModeEnum.yourself:
      return (
        <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
          <FaPersonCircleQuestion className="mb-4"/>
          <div className="text-lg">You can&#39;t add yourself...</div>
        </div>
      )
    case errorModeEnum.serverError:
      return (
        <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
          <FaTriangleExclamation className="mb-4"/>
          <div className="text-lg">Oops, something went wrong...</div>
          <div className="text-lg">Please try that again</div>
        </div>
      )
    default:
      break;
  }
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
        <FaHourglass className="mb-4"/>
        <div className="text-lg">Looking for the person...</div>
      </div>
    )
  }
  if (result?._id) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Image
          src={result.profilePicture || '/images/default-profile-picture.webp'}
          className="rounded-full mb-2"
          height={80}
          width={80}
          alt="profile-picture"
        />
        <div className="text-lg font-semibold mb-3">{result.fullName}</div>
        {
          result.alreadyPeers ?
            (
              <button
                className="px-3 py-2 rounded-lg drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark transition duration-300"
                onClick={handleClickViewProfile}
              >
                View Profile
              </button>
            ) :
            (
              <button
                className="px-3 py-2 rounded-lg drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark transition duration-300"
                onClick={handleClickAdd}
              >
                Add
              </button>
            )
        }
      </div>
    )
  }
  return '';
}

const AddPeerPage = () => {

  const [peerEmail, setPeerEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState({})
  const [errorMode, setErrorMode] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult({})

    searchPeer(peerEmail)
      .then(handleSearchResult)
      .catch(handleFailSearchPeer)
      .finally(() => setIsLoading(false))
  }

  const handleSearchResult = (res) => {
    setErrorMode(null)
    setResult(res.body)
  }

  const handleFailSearchPeer = (res) => {
    setErrorMode(res.body.error)
  }

  return (
    <section className="p-6 flex flex-grow h-full flex-col">
      <div className="flex gap-3 items-center text-primary font-bold text-xl mb-3">
        <Link href="/contact">
          <FaArrowLeft />
        </Link>
        <span className="cursor-default">
          Add New Peer
        </span>
      </div>
      <span className="text-sm text-neutral-500">
        Email has to be an exact match
      </span>
      <form className="flex gap-2 items-center mb-3" onSubmit={handleSearch}>
        <input
          required
          className="rounded drop-shadow-sm p-2 w-[40%] focus:outline-none focus:ring-primary focus:ring-2"
          type="email"
          placeholder="Input peer email"
          onChange={e => setPeerEmail(e.target.value)}
        />
        <button
          className="p-3 rounded-lg drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark transition duration-300"
          type="submit"
        >
          <FaMagnifyingGlass/>
        </button>
      </form>
      <div className="flex h-full bg-neutral-50 rounded-md drop-shadow-md justify-center items-center">
        <Result
          isLoading={isLoading}
          result={result}
          errorMode={errorMode}
        />
      </div>
    </section>
  )
}

export default AddPeerPage