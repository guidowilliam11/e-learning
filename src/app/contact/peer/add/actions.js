import { _responseAdapter } from "@/utils/adapter"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const searchPeer = async email => {
  return fetch(`${baseUrl}/api/contact/peer/add?email=${email}`).then(_responseAdapter)
}

export const addPeer = async targetPeer => {
  return fetch(`${baseUrl}/api/contact/peer/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetPeer)
  }).then(_responseAdapter)
}