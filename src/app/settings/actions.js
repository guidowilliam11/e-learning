import { _responseAdapter } from "@/utils/adapter"


export const updateProfile = async (newUserData) => {
  return fetch(`/api/settings/profile`, {
    method: 'PATCH',
    body: newUserData
  }).then(_responseAdapter)
}

export const updatePreferences = async (newPreferences) => {
  return fetch(`/api/settings/preferences`, {
    method: 'PUT',
    body: JSON.stringify(newPreferences)
  }).then(_responseAdapter)
}