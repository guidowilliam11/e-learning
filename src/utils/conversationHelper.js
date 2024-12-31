export const profileConstructor = (conversation, userId) => {
  const { type, participants, picture } = conversation

  let peer = {}

  if (type === "peer") {
    peer = participants.find((participant) => participant._id !== userId)
  }
  const displayedName = conversation.name ?? peer.fullName
  const fallbackPicture =
    type === "peer"
      ? "/images/default-profile-picture.webp"
      : "/images/default-community-picture.png"
  const displayedPicture = picture || peer.picture || fallbackPicture

  return {
    displayedName, displayedPicture, peer
  }
}

export const classifyConversationsData = (conversationsData, conversationType) => {
  const conversationsDataIterator = conversationsData[Symbol.iterator]()
  const result = []
  for (const entry of conversationsDataIterator) {
    entry[1].type === conversationType && result.push(entry[1])
  }
  return result
}