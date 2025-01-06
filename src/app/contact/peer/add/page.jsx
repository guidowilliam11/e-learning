'use client'

import Link from 'next/link'
import {
  FaArrowLeft,
  FaMagnifyingGlass,
  FaHourglass,
  FaTriangleExclamation,
  FaPersonCircleQuestion,
  FaUserSecret,
} from 'react-icons/fa6'
import { useState } from 'react'
import Image from 'next/image'
import { addPeer, searchPeer } from '@/app/contact/peer/add/actions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useFullscreenLoadingContext } from '@/contexts/fullscreenLoadingContext'

const errorModeEnum = {
  notFound: 'NOT_FOUND',
  yourself: 'YOURSELF',
  serverError: '500',
  inviteNotAllowed: 'INVITE_NOT_ALLOWED',
}

const Result = ({ isLoading, result, setResult, errorMode }) => {
  const router = useRouter()
  const { setIsFullscreenLoading } = useFullscreenLoadingContext()

  const handleClickAdd = () => {
    setIsFullscreenLoading(true)
    addPeer(result)
      .then(handleAddResult)
      .catch(handleFailAddPeer)
      .finally(() => setIsFullscreenLoading(false))
  }

  const handleAddResult = (res) => {
    setResult(res.body)
    toast.success('Successfully added peer!')
  }

  const handleFailAddPeer = (res) => {
    const { error } = res.body
    if (error === 'INVITE_NOT_ALLOWED') {
      toast.error(`They don't want to be invited`)
      return
    }
    toast.error('Oops, something went wrong. Please try that again.')
  }

  const handleClickViewProfile = () => {
    router.push(`/contact/peer?email=${result.email}`)
  }

  switch (errorMode) {
    case errorModeEnum.notFound:
      return (
        <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
          <FaPersonCircleQuestion className="mb-4" />
          <div className="text-lg">
            We searched high and low, but found no one...
          </div>
          <div className="text-lg">Make sure the email is correct</div>
        </div>
      )
    case errorModeEnum.yourself:
      return (
        <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
          <FaPersonCircleQuestion className="mb-4" />
          <div className="text-lg">You can&#39;t add yourself...</div>
        </div>
      )
    case errorModeEnum.serverError:
      return (
        <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
          <FaTriangleExclamation className="mb-4" />
          <div className="text-lg">Oops, something went wrong...</div>
          <div className="text-lg">Please try that again</div>
        </div>
      )
    case errorModeEnum.inviteNotAllowed:
      return (
        <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
          <FaUserSecret className="mb-4" />
          <div className="text-lg">They don't want to be invited...</div>
        </div>
      )
    default:
      break
  }
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center text-7xl text-neutral-400">
        <FaHourglass className="mb-4" />
        <div className="text-lg">Looking for the person...</div>
      </div>
    )
  }
  if (result?._id) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Image
          src={result.picture || '/images/default-profile-picture.webp'}
          className="rounded-full mb-2"
          height={80}
          width={80}
          alt="profile-picture"
        />
        <div className="text-lg font-semibold mb-3">{result.fullName}</div>
        {result.alreadyPeers ? (
          <button
            className="px-3 py-2 rounded-lg drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark transition duration-300"
            onClick={handleClickViewProfile}
          >
            View Profile
          </button>
        ) : (
          <button
            className="px-3 py-2 rounded-lg drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark transition duration-300"
            onClick={handleClickAdd}
          >
            Add
          </button>
        )}
      </div>
    )
  }
  return ''
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
        <span className="cursor-default">Add New Peer</span>
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
          onChange={(e) => setPeerEmail(e.target.value)}
        />
        <button
          className="p-3 rounded-lg drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark transition duration-300"
          type="submit"
        >
          <FaMagnifyingGlass />
        </button>
      </form>
      <div className="flex h-full bg-neutral-50 rounded-md drop-shadow-md justify-center items-center">
        <Result
          isLoading={isLoading}
          result={result}
          errorMode={errorMode}
          setResult={setResult}
        />
      </div>
    </section>
  )
}

export default AddPeerPage
