import { _responseAdapter } from "@/utils/adapter"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getPeers = async () => {
  return fetch(`${baseUrl}/api/contact/peers`).then(_responseAdapter)
}

export const createCommunity = async (formData) => {
  return fetch(`${baseUrl}/api/contact/community`, {
    method: 'POST',
    body: formData
  }).then(_responseAdapter)
}