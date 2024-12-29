import { _responseAdapter } from "@/utils/adapter"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const validateRoomData = async (roomType, conversationId) => {
  return fetch(`${baseUrl}/api/call`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomType,
      conversationId
    })
  })
    .then(_responseAdapter)
}