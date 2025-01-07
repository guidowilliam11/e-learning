import { useEffect, useState } from 'react'

const VideoStream = ({
  participant,
  mediaStream,
  mediaStreamState,
  isUserStream,
}) => {
  const [usedMediaStreamState, setUsedMediaStreamState] = useState(
    isUserStream ? mediaStreamState : mediaStreamState.get(participant._id)
  )

  useEffect(() => {
    setUsedMediaStreamState(
      isUserStream ? mediaStreamState : mediaStreamState.get(participant._id)
    )
  }, [isUserStream, mediaStreamState, participant])

  const handleMountMediaStream = (node) => {
    if (isUserStream) {
      mediaStream.current = node
    } else {
      mediaStream.current.set(participant._id, node)
    }
  }

  return (
    <div
      className="rounded-2xl bg-black max-h-full aspect-video w-[32%] flex-grow justify-center items-center relative"
      style={
        (!usedMediaStreamState?.srcObject && isUserStream) ||
        usedMediaStreamState?.srcObject
          ? { display: 'flex' }
          : { display: 'none' }
      }
    >
      <video
        className="h-full"
        style={
          usedMediaStreamState?.srcObject &&
          usedMediaStreamState?.srcObject?.getVideoTracks()[0]?.enabled
            ? { display: 'block' }
            : { display: 'none' }
        }
        ref={handleMountMediaStream}
        muted={isUserStream}
      ></video>
      {/* <span
				className="text-neutral-50"
				style={
					usedMediaStreamState?.srcObject &&
					usedMediaStreamState?.srcObject?.getVideoTracks()[0]?.enabled
						? { display: "none" }
						: { display: "inline" }
				}
			>
				{
					participant.fullName ?? 'You'
				}
			</span> */}
      <div className="text-neutral-50 text-sm absolute bottom-3 left-3">
        {isUserStream ? 'You' : participant.fullName}
      </div>
    </div>
  )
}

export default VideoStream
