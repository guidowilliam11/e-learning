"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import VideoStream from "@/app/call/[id]/components/VideoStream";
import Peer from "peerjs";
import { FaVideo, FaMicrophone } from 'react-icons/fa6';

const mockPeers = [
	"1bfaf1a4-6226-4d53-9b88-f9e2fad906a9",
	"9bd3de10-8f30-47c0-9764-92752c33e9db",
	"9bd3de10-8f30-47c0-9764-92752c33e9dc",
];

const CallPage = () => {
	const peerInstance = useRef(null);
	const [peerId, setPeerId] = useState(mockPeers[0]);

	const userStream = useRef(null);
	const [userStreamState, setUserStreamState] = useState(userStream.current);
	const [videoStatus, setVideoStatus] = useState(false);
	const [audioStatus, setAudioStatus] = useState(false);
	const targetParticipants = useMemo(
		() => mockPeers.filter((mockPeer) => mockPeer !== peerId),
		[peerId]
	);
	const remoteStreams = useRef(new Map());
	const [remoteStreamsState, setRemoteStreamsState] = useState(
		remoteStreams.current
	);

	useEffect(() => {
		const peer = new Peer(peerId);
		peer.on("open", (id) => {
			setPeerId(id);
		});

		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		}).then(mediaStream => {
			userStream.current.srcObject = mediaStream;
			userStream.current.play();
			setUserStreamState(userStream.current);
			toggleMic()
			toggleVideo()
		});

		peer.on("call", async (call) => {
			call.answer(userStream.current.srcObject);
			call.on("stream", (incomingStream) => {
				remoteStreams.current.get(call.peer).srcObject = incomingStream;
				remoteStreams.current.get(call.peer).play();
				setRemoteStreamsState(new Map(remoteStreams.current));
			});
		});

		peerInstance.current = peer;
	}, [targetParticipants, peerId]);

	const handleCall = async () => {
		targetParticipants.forEach((mockPeer) => {
			const call = peerInstance.current.call(mockPeer, userStream.current.srcObject);

			call.on("stream", (incomingStream) => {
				remoteStreams.current.get(mockPeer).srcObject = incomingStream;
				remoteStreams.current.get(mockPeer).play();
				setRemoteStreamsState(new Map(remoteStreams.current));
			});
		});
	};

	const toggleVideo = () => {
		const userVideoTrack = userStream.current?.srcObject?.getVideoTracks()[0];
		if (!userVideoTrack) {
			return;
		}
		userVideoTrack.enabled = !userVideoTrack.enabled;
		setVideoStatus(userVideoTrack.enabled);
		setUserStreamState(userStream.current);
	};

	const toggleMic = () => {
		const userAudioTrack = userStream.current?.srcObject?.getAudioTracks()[0];
		if (!userAudioTrack) {
			return;
		}
		userAudioTrack.enabled = !userAudioTrack.enabled;
		setAudioStatus(userAudioTrack.enabled);
		setUserStreamState(userStream.current);
	};

	return (
		<section className="flex flex-col h-[100vh] p-4 bg-neutral-700">
			<h1 className="text-neutral-50">Current user id is {peerId}</h1>
			<div>
				<select value={peerId} onChange={(e) => setPeerId(e.target.value)}>
					{mockPeers.map((mockPeer) => (
						<option key={mockPeer} value={mockPeer}>
							{mockPeer}
						</option>
					))}
				</select>
				<button className="text-neutral-50" onClick={handleCall}>Call</button>
			</div>
			<div className="flex my-4 gap-2 h-full justify-center items-center flex-wrap overflow-auto">
				<VideoStream
					peerId={peerId}
					mediaStream={userStream}
					mediaStreamState={userStreamState}
					isUserStream={true}
				/>
				{targetParticipants.map((mockPeer) => (
					<VideoStream
						key={mockPeer}
						peerId={mockPeer}
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
						"text-neutral-50 rounded-full p-5 " + (videoStatus ? "bg-secondary" : "bg-red-600")
					}
				>
					<FaVideo />
				</button>
				<button
					className={
						"text-neutral-50 rounded-full p-5 " + (audioStatus ? "bg-secondary" : "bg-red-600")
					}
					onClick={toggleMic}
				>
					<FaMicrophone />
				</button>
			</div>
		</section>
	);
};

export default CallPage;
