import { _responseAdapter } from "@/utils/adapter"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getCommunity = async (communityId) => {
  return fetch(`${baseUrl}/api/contact/community?communityId=${communityId}`).then(_responseAdapter)
}

export const removeMember = async (communityId, studentId) => {
  return fetch(`${baseUrl}/api/contact/community`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ communityId, studentId })
  }).then(_responseAdapter)
}

export const editCommunity = async (formData) => {
  return fetch(`${baseUrl}/api/contact/community`, {
    method: 'PATCH',
    body: formData
  }).then(_responseAdapter)
}

export const getPeersToInvite = async (communityId) => {
  return fetch(`${baseUrl}/api/contact/community/invite?communityId=${communityId}`).then(_responseAdapter)
}

export const invitePeer = async (communityId, peerStudentId) => {
  return fetch(`${baseUrl}/api/contact/community/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ communityId, peerStudentId })
  }).then(_responseAdapter)
}