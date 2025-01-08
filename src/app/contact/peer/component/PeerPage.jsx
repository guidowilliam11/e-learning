'use client'

import { FaArrowLeft, FaBan } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getPeerData } from '@/app/contact/peer/actions'
import { toast } from 'react-toastify'
import { useFullscreenLoadingContext } from '@/contexts/fullscreenLoadingContext'
import { addPeer } from '../add/actions'

const PeerPage = ({ peerEmail }) => {
  const { setIsFullscreenLoading } = useFullscreenLoadingContext()

  const router = useRouter()
  const [peer, setPeerData] = useState({})

  useEffect(() => {
    setIsFullscreenLoading(true)
    if (!peerEmail) {
      router.push(`/contact`)
    }

    getPeerData(peerEmail)
      .then(handlePeerData)
      .catch(handleFailGetPeerData)
      .finally(() => setIsFullscreenLoading(false))
  }, [peerEmail])

  const handlePeerData = (res) => {
    setPeerData(res.body)
  }

  const handleFailGetPeerData = (res) => {
    const { error } = res.body
    if (error === 'PEER_NOT_FOUND') {
      toast.error(`The student doesn't exist.`)
      setTimeout(() => router.push('/contact'), 1000)
      return
    }
    toast.error('Oops, something went wrong. Please try that again.')
  }

  const handleClickBack = () => {
    router.back()
  }

  const handleClickAdd = () => {
    setIsFullscreenLoading(true)
    addPeer(peer)
      .then(handleAddResult)
      .catch(handleFailAddPeer)
      .finally(() => setIsFullscreenLoading(false))
  }

  const handleAddResult = (res) => {
    if (res.body._id) {
      setPeerData(res.body)
      toast.success('Successfully added peer!')
    }
  }

  const handleFailAddPeer = (res) => {
    const { error } = res.body
    if (error === 'INVITE_NOT_ALLOWED') {
      toast.error(`They don't want to be invited`)
      return
    }
    toast.error('Oops, something went wrong. Please try that again.')
  }

  return (
    <section className='flex flex-col flex-grow h-full p-6 overflow-y-auto'>
      <div className='flex items-center justify-between p-4 mb-4 text-lg font-bold rounded-md bg-neutral-50 drop-shadow-md text-primary'>
        <div className='flex items-center gap-4'>
          <button onClick={handleClickBack}>
            <FaArrowLeft />
          </button>
          <span className='cursor-default'>Peer</span>
        </div>
        <div className='flex items-center gap-5'>
          {/*TODO: Block*/}
          {/*<button*/}
          {/*  className="text-primaryDark"*/}
          {/*  onClick={() => router.back()}*/}
          {/*>*/}
          {/*  <FaBan />*/}
          {/*</button>*/}
        </div>
      </div>
      <div className='flex flex-col justify-center p-4 rounded-md bg-neutral-50 drop-shadow-md'>
        <div className='flex flex-col items-center'>
          <Image
            src={peer.picture || '/images/default-profile-picture.webp'}
            width={175}
            height={175}
            alt={peer.fullName || 'Peer'}
            className='mb-3 rounded-full drop-shadow-lg'
          />
          <div className='mb-1 text-3xl font-bold text-primary'>
            {peer.fullName}
          </div>
          <div className='text-md font-semibold text-neutral-600 max-w-[50%] break-all text-center mb-2'>
            {peer.email}
          </div>
          <div className='text-lg font-semibold text-neutral-700 max-w-[50%] break-all text-center'>
            {peer.description}
          </div>
          {!peer.alreadyPeers ? (
            <button
              className='px-3 py-2 transition duration-300 rounded-lg drop-shadow-sm text-neutral-50 bg-primary hover:bg-primaryDark'
              onClick={handleClickAdd}
            >
              Add
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default PeerPage
