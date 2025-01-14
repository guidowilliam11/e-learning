"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import VideoStream from "@/app/call/[id]/components/VideoStream"
import Peer from "peerjs"
import { FaVideo, FaMicrophone, FaPhoneSlash } from "react-icons/fa6"
import { getSession } from "next-auth/react"
import { validateRoomData } from "./actions"
import { redirect, usePathname, useSearchParams } from "next/navigation"
import { useFullscreenLoadingContext } from "@/contexts/fullscreenLoadingContext"
import { toast } from "react-toastify"

const CallPage = () => {
  const { setIsFullscreenLoading } = useFullscreenLoadingContext()
  const conversationId = usePathname().split("/")[2]
  const roomType = useSearchParams().get("type")

  const peerInstance = useRef(null)
  const [peerId, setPeerId] = useState("")

  const [roomData, setRoomData] = useState({})
  const roomParticipants = useMemo(
    () => roomData?.participants || [],
    [roomData]
  )
  const targetParticipants = useMemo(
    () =>
      roomParticipants.filter((participants) => participants._id !== peerId),
    [peerId, roomParticipants]
  )
  const displayedRoomName = useMemo(() => {
    if (roomData?.name) {
      return roomData.name
    }
    if (targetParticipants?.[0]?.fullName) {
      return targetParticipants[0].fullName
    }
    return "Initiating call..."
  }, [roomData, targetParticipants])

  const userStream = useRef(null)
  const [userStreamState, setUserStreamState] = useState(userStream.current)
  const [videoStatus, setVideoStatus] = useState(false)
  const [audioStatus, setAudioStatus] = useState(false)
  const remoteStreams = useRef(new Map())
  const [remoteStreamsState, setRemoteStreamsState] = useState(
    remoteStreams.current
  )
  const [peerOpened, setPeerOpened] = useState(false)
  const [peerDoneSetup, setPeerDoneSetup] = useState(false)

  const setupRoomData = () => {
    validateRoomData(roomType, conversationId).then(
      handleSuccessValidateRoomData
    )
  }
  const handleSuccessValidateRoomData = (res) => {
    setRoomData(res.body)
  }

  const setupPeerInstance = () => {
    const peer = new Peer(`${conversationId}_${peerId}`)
    peer.on("open", (id) => {
      console.log(id, "setup")
      setPeerOpened(true)
    })

    peer.on("call", async (call) => {
      call.answer(userStream.current.srcObject)
      call.on("stream", (incomingStream) => {
        console.log(call.peer, "call")
        remoteStreams.current.get(call.peer).srcObject = incomingStream
        remoteStreams.current.get(call.peer).play()
        setRemoteStreamsState(new Map(remoteStreams.current))
      })
      call.on("close", (incomingStream) => {
        remoteStreams.current.get(call.peer).srcObject = null
        setRemoteStreamsState(new Map(remoteStreams.current))
      })
    })

    peerInstance.current = peer

    setPeerDoneSetup(true)
  }

  const initiateCall = async () => {
    targetParticipants.forEach((targetParticipant) => {
      const call = peerInstance.current.call(
        `${conversationId}_${targetParticipant._id}`,
        userStream.current.srcObject
      )

      call.on("stream", (incomingStream) => {
        console.log(call.peer, "call")
        remoteStreams.current.get(call.peer).srcObject = incomingStream
        remoteStreams.current.get(call.peer).play()
        setRemoteStreamsState(new Map(remoteStreams.current))
      })
      call.on("close", (incomingStream) => {
        remoteStreams.current.get(call.peer).srcObject = null
        setRemoteStreamsState(new Map(remoteStreams.current))
      })
    })
  }

  const toggleVideo = () => {
    const userVideoTrack = userStream.current?.srcObject?.getVideoTracks()[0]
    if (!userVideoTrack) {
      return
    }
    userVideoTrack.enabled = !userVideoTrack.enabled
    setVideoStatus(userVideoTrack.enabled)
    setUserStreamState(userStream.current)
  }

  const toggleMic = () => {
    const userAudioTrack = userStream.current?.srcObject?.getAudioTracks()[0]
    if (!userAudioTrack) {
      return
    }
    userAudioTrack.enabled = !userAudioTrack.enabled
    setAudioStatus(userAudioTrack.enabled)
    setUserStreamState(userStream.current)
  }

  const hangupCall = () => {
    if (peerInstance.current) {
      peerInstance.current.disconnect()
      peerInstance.current.destroy()
    }
    window.close()
  }

  useEffect(() => {
    setIsFullscreenLoading(true)
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((mediaStream) => {
        userStream.current.srcObject = mediaStream
        userStream.current.play()
        setUserStreamState(userStream.current)
        toggleMic()
        toggleVideo()
        getSession().then((session) => {
          !session && redirect("/login")
          const { user } = session
          setPeerId(user.id)
          setupRoomData()
        })
      })
      .catch((error) => {
        if (error?.name === "NotAllowedError") {
          toast.error(
            "Please allow permission to access camera and microphone, then reopen the page."
          )
        }
      })
  }, [])

  useEffect(() => {
    if (roomData?._id) {
      setupPeerInstance()
    }
  }, [roomData])

  useEffect(() => {
    if (peerOpened && peerDoneSetup) {
      initiateCall()
      setIsFullscreenLoading(false)
    }
  }, [peerOpened, peerDoneSetup])

  return (
    <section className="flex flex-col h-[100vh] p-4 bg-neutral-700">
      <h1 className="text-primary font-bold text-xl">{displayedRoomName}</h1>
      <div className="flex my-4 gap-2 h-full justify-center items-center flex-wrap overflow-auto">
        <VideoStream
          conversationId={conversationId}
          participant={{ _id: peerId }}
          mediaStream={userStream}
          mediaStreamState={userStreamState}
          isUserStream={true}
        />
        {targetParticipants.map((targetParticipant) => (
          <VideoStream
            key={targetParticipant._id}
            conversationId={conversationId}
            participant={targetParticipant}
            mediaStream={remoteStreams}
            mediaStreamState={remoteStreamsState}
            isUserStream={false}
          />
        ))}
      </div>
      <div className="flex justify-center items-center flex-wrap gap-3">
        <button
          onClick={toggleVideo}
          className={
            "text-neutral-50 rounded-full p-5 " +
            (videoStatus ? "bg-secondary" : "bg-red-600")
          }
        >
          <FaVideo />
        </button>
        <button
          className={
            "text-neutral-50 rounded-full p-5 " +
            (audioStatus ? "bg-secondary" : "bg-red-600")
          }
          onClick={toggleMic}
        >
          <FaMicrophone />
        </button>
        <button
          className={"text-neutral-50 rounded-full p-5 bg-red-600"}
          onClick={hangupCall}
        >
          <FaPhoneSlash />
        </button>
      </div>
    </section>
  )
}

export default CallPage
