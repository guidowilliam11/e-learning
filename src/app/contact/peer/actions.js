import { _responseAdapter } from "@/utils/adapter"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const getPeerData = async targetStudentId => {
  return fetch(`${baseUrl}/api/contact/peer?targetStudentId=${targetStudentId}`).then(_responseAdapter)
}