import { _responseAdapter } from "@/utils/adapter"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getPeerData = async email => {
  return fetch(`${baseUrl}/api/contact/peer?email=${email}`).then(_responseAdapter)
}