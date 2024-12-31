import { _responseAdapter } from "@/utils/adapter"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getContacts = async () => {
  return fetch(`${baseUrl}/api/contacts`)
    .then(_responseAdapter)
}

export const validateMessages = async (conversationId) => {
  return fetch(`${baseUrl}/api/contact/messages`, {
    method: 'POST',
    body: JSON.stringify({ conversationId })
  }).then(_responseAdapter)
}

export const postMessage = async (formData) => {
  return fetch(`${baseUrl}/api/contact/message`, {
    method: 'POST',
    body: formData
  }).then(_responseAdapter)
}