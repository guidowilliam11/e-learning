"use client"

import { useFullscreenLoadingContext } from "@/contexts/fullscreenLoadingContext"
import { getSession, useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import "./style.css"
import { updatePreferences, updateProfile } from "./actions"
import { toast } from "react-toastify"

const ProfileSection = ({ user, handleUpdateProfile, errorMode }) => {
  const [newUserData, setNewUserData] = useState({})
  const picturePreview = useMemo(() => {
    if (!newUserData.picture) {
      return ""
    }
    if (typeof newUserData.picture === "string") {
      return newUserData.picture
    }
    return URL.createObjectURL(newUserData.picture)
  }, [newUserData])
  const imageInput = useRef(null)
  const isChanged = useMemo(() => {
    return (
      user.fullName !== newUserData.fullName ||
      user.picture !== newUserData.picture ||
      user.email !== newUserData.email ||
      newUserData?.newPassword
    )
  }, [user, newUserData])

  const handlePictureChange = (e) => {
    if (e.target.files.length > 0) {
      if (e.target.files[0].size > 10000000) {
        toast.error("File size cannot exceed 10 MB!")
        imageInput.current.value = ""
        return
      }
      setNewUserData({ ...newUserData, picture: e.target.files[0] })
    }
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(profileForm)
    formData.set("picture", newUserData.picture)

    handleUpdateProfile(formData)
  }

  useEffect(() => {
    setNewUserData(user)
  }, [user])

  return (
    <div className="p-6 bg-white border rounded-card border-line">
      <h2 className="mb-4 text-base font-semibold">Profile</h2>
      <form
        className="flex flex-col w-full"
        id="profileForm"
        onSubmit={handleProfileSubmit}
      >
        <input
          type="text"
          id="studentId"
          name="studentId"
          defaultValue={newUserData?.id}
          key={newUserData?.id}
          required
          hidden
        />
        <div className="flex flex-col items-start w-full mb-2">
          <div className="relative image-upload-wrapper w-fit">
            <Image
              src={picturePreview || "/images/default-profile-picture.webp"}
              width={96}
              height={96}
              alt={newUserData?.name || "Picture"}
              className="object-cover rounded-full cursor-pointer size-24"
              title="Click to upload a new picture"
            />
            <label
              className="image-upload-overlay flex items-center justify-center rounded-full text-xs text-neutral-50"
              htmlFor="imageInput"
            >
              Upload Picture
            </label>
          </div>
          <span className="mt-2 text-xs text-ink-3">Click the photo to upload a new one (PNG or JPG, up to 10 MB)</span>
          <input
            name="picture"
            type="file"
            id="imageInput"
            ref={imageInput}
            hidden
            accept=".png,.jpeg,.jpg"
            onChange={handlePictureChange}
          />
        </div>
        <div className="flex flex-col w-full my-2.5 text-sm font-medium text-ink">
          <label htmlFor="fullName">
            Name<span className="text-red-600" aria-hidden> *</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={newUserData.fullName || ""}
            className="w-full h-10 px-3 mt-1.5 text-sm bg-white border rounded-md border-line placeholder:text-ink-3 focus:outline-none focus:border-accent"
            onChange={(e) =>
              setNewUserData({ ...newUserData, fullName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col w-full my-2.5 text-sm font-medium text-ink">
          <label htmlFor="email">
            Email<span className="text-red-600" aria-hidden> *</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={newUserData.email || ""}
            className="w-full h-10 px-3 mt-1.5 text-sm bg-white border rounded-md border-line placeholder:text-ink-3 focus:outline-none focus:border-accent"
            onChange={(e) =>
              setNewUserData({ ...newUserData, email: e.target.value })
            }
          />
          {errorMode === "EMAIL_NOT_AVAILABLE" && (
            <label htmlFor="email" className="text-red-600 text-sm">
              Email is not available
            </label>
          )}
        </div>
        <div className="flex flex-col w-full my-2.5 text-sm font-medium text-ink">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            placeholder="Enter a new password if you want to change your old one"
            id="newPassword"
            name="newPassword"
            className="w-full h-10 px-3 mt-1.5 text-sm bg-white border rounded-md border-line placeholder:text-ink-3 focus:outline-none focus:border-accent"
            minLength="6"
            value={newUserData?.newPassword || ""}
            onChange={(e) =>
              setNewUserData({ ...newUserData, newPassword: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col w-full my-2.5 text-sm font-medium text-ink">
          <label htmlFor="oldPassword">
            Old Password<span className="text-red-600" aria-hidden> *</span>
          </label>
          <input
            type="password"
            placeholder="To make sure it's really you"
            id="oldPassword"
            name="oldPassword"
            required
            className="w-full h-10 px-3 mt-1.5 text-sm bg-white border rounded-md border-line placeholder:text-ink-3 focus:outline-none focus:border-accent"
          />
          {errorMode === "INVALID_PASSWORD" && (
            <label htmlFor="email" className="text-red-600 text-sm">
              Old password is invalid
            </label>
          )}
        </div>
        <div className="flex justify-end w-full mt-4">
          <button
            type="submit"
            className={
              "h-9 px-4 text-sm font-medium rounded-md transition " +
              (isChanged
                ? "bg-accent text-white hover:bg-accent-hover "
                : "bg-page text-ink-3 border border-line cursor-not-allowed")
            }
            disabled={!isChanged}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

const PreferencesSection = ({ preferences, handleUpdatePreferences }) => {
  const [newPreferences, setNewPreferences] = useState({})
  const isChanged = useMemo(() => {
    return preferences?.allowPeerInvite !== newPreferences?.allowPeerInvite
  }, [preferences, newPreferences])

  const handlePreferencesSubmit = (e) => {
    e.preventDefault()

    handleUpdatePreferences(newPreferences)
  }

  useEffect(() => {
    setNewPreferences(preferences)
  }, [preferences])

  return (
    <div className="p-6 bg-white border rounded-card border-line">
      <h2 className="mb-2 text-base font-semibold">Preferences</h2>
      <form
        className="flex flex-col w-full text-sm text-ink"
        onSubmit={handlePreferencesSubmit}
      >
        <div className="flex items-center justify-between w-full py-2">
          <label htmlFor="allowPeerInvite">
            Allow other peers to invite you
          </label>
          <input
            type="checkbox"
            id="allowPeerInvite"
            name="allowPeerInvite"
            checked={newPreferences?.allowPeerInvite || false}
            value="true"
            className="size-4 accent-[#4F55DA]"
            onChange={() =>
              setNewPreferences({
                ...newPreferences,
                allowPeerInvite: !newPreferences.allowPeerInvite,
              })
            }
          />
        </div>
        <div className="flex justify-end w-full mt-4">
          <button
            type="submit"
            className={
              "h-9 px-4 text-sm font-medium rounded-md transition " +
              (isChanged
                ? "bg-accent text-white hover:bg-accent-hover "
                : "bg-page text-ink-3 border border-line cursor-not-allowed")
            }
            disabled={!isChanged}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

const SettingsPage = () => {
  const router = useRouter()
  const { setIsFullscreenLoading } = useFullscreenLoadingContext()
  const { update } = useSession()

  const [user, setUser] = useState({})
  const [errorMode, setErrorMode] = useState("")

  const handleUpdateProfile = (newUserData) => {
    setIsFullscreenLoading(true)
    updateProfile(newUserData)
      .then(handleSuccessUpdateProfile)
      .catch(handleFailUpdateProfile)
      .finally(() => setIsFullscreenLoading(false))
  }

  const handleSuccessUpdateProfile = (res) => {
    setUser(res.body)
    update({ newProfile: res.body }).then(() =>
      toast.success("Profile has been saved!")
    )
  }

  const handleFailUpdateProfile = (res) => {
    const { error } = res.body
    if (error === "EMAIL_NOT_AVAILABLE") {
      toast.error("Email is not available")
      setErrorMode(error)
      return
    }
    if (error === "INVALID_PASSWORD") {
      toast.error("Old password is invalid")
      setErrorMode(error)
      return
    }
    toast.error("Oops something went wrong. Please try that again.")
  }

  const handleUpdatePreferences = (newPreferences) => {
    setIsFullscreenLoading(true)
    updatePreferences(newPreferences)
      .then(handleSuccessUpdatePreferences)
      .catch(handleFailUpdatePreferences)
      .finally(() => setIsFullscreenLoading(false))
  }

  const handleSuccessUpdatePreferences = (res) => {
    setUser({ ...user, preferences: res.body.preferences })
    update({ newPreferences: res.body.preferences }).then(() =>
      toast.success("Preferences has been saved!")
    )
  }

  const handleFailUpdatePreferences = (res) => {
    toast.error("Oops something went wrong. Please try that again.")
  }

  useEffect(() => {
    setIsFullscreenLoading(true)
    getSession()
      .then((session) => setUser(session.user))
      .finally(() => setIsFullscreenLoading(false))
  }, [])

  return (
    <section className="max-w-[640px] space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-ink-2">Your profile and who can reach you.</p>
      </div>
      <ProfileSection
        user={user}
        handleUpdateProfile={handleUpdateProfile}
        errorMode={errorMode}
      />
      <PreferencesSection
        preferences={user.preferences}
        handleUpdatePreferences={handleUpdatePreferences}
      />
    </section>
  )
}

export default SettingsPage
