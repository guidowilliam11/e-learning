import { _responseAdapter } from "@/utils/adapter"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getCommunity = async (communityId) => {
  return fetch(`${baseUrl}/api/contact/community?communityId=${communityId}`).then(_responseAdapter)
}

export const leaveCommunity = async (communityId) => {
  return fetch(`${baseUrl}/api/contact/community`, {
    method: 'DELETE',
    'Content-Type': 'application/json',
    body: JSON.stringify({ communityId })
  }).then(_responseAdapter)
}

export const editCommunity = async (formData) => {
  return fetch(`${baseUrl}/api/contact/community`, {
    method: 'PATCH',
    'Content-Type': 'multipart/formdata',
    body: formData
  }).then(_responseAdapter)
}