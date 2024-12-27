import { useEffect, useState } from "react";

const VideoStream = ({ peerId, mediaStream, mediaStreamState, isUserStream }) => {

	const [usedMediaStreamState, setUsedMediaStreamState] = useState(isUserStream ? mediaStreamState : mediaStreamState.get(peerId))

	useEffect(() => {
		setUsedMediaStreamState(isUserStream ? mediaStreamState : mediaStreamState.get(peerId))
	}, [isUserStream, mediaStreamState, peerId])

	const handleMountMediaStream = node => {
		if (isUserStream) {
			mediaStream.current = node
		} else {
			mediaStream.current.set(peerId, node)
		}
	}

	return (
		<div
			className="rounded-2xl bg-neutral-800 max-h-full aspect-video w-[32%] flex-grow justify-center items-center"
			style={
				(!usedMediaStreamState?.srcObject && isUserStream) ||
				usedMediaStreamState?.srcObject
					? { display: "flex" }
					: { display: "none" }
			}
		>
			<video
				className="h-full"
				style={
					usedMediaStreamState?.srcObject &&
					usedMediaStreamState?.srcObject?.getVideoTracks()[0]?.enabled
						? { display: "block" }
						: { display: "none" }
				}
				ref={handleMountMediaStream}
			></video>
			<span
				className="text-neutral-50"
				style={
					usedMediaStreamState?.srcObject &&
					usedMediaStreamState?.srcObject?.getVideoTracks()[0]?.enabled
						? { display: "none" }
						: { display: "inline" }
				}
			>
				Ketutup
			</span>
		</div>
	);
};

export default VideoStream;
