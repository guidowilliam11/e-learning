"use client"

import { useFullscreenLoadingContext } from "@/contexts/fullscreenLoadingContext"
import { getSession, useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { FaArrowLeft } from "react-icons/fa6"
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
    <div className="flex flex-col bg-neutral-50 rounded-md drop-shadow-md p-4 justify-between items-center text-lg font-bold text-primary mb-4">
      <span className="cursor-default w-1/2">Profile</span>
      <form
        className="flex flex-col items-center text-md font-normal w-1/2"
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
        <div className="flex flex-col my-2 items-center">
          <div className="relative image-upload-wrapper w-fit">
            <Image
              src={picturePreview || "/images/default-profile-picture.webp"}
              width={150}
              height={150}
              alt={newUserData?.name || "Picture"}
              className="rounded-full drop-shadow-lg cursor-pointer"
              title="Click to upload a new picture"
            />
            <label
              className="image-upload-overlay flex items-center justify-center rounded-full text-xs text-neutral-50"
              htmlFor="imageInput"
            >
              Upload Picture
            </label>
          </div>
          <span className="text-xs text-neutral-400 mt-1">
            <sup>*</sup>Click picture to upload a new one
          </span>
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
        <div className="flex flex-col my-2 items-start w-full">
          <label htmlFor="fullName">
            Name<sup className="text-red-600">*</sup>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={newUserData.fullName || ""}
            className="w-full bg-neutral-50 text-black border-2 border-neutral-50 border-b-primary p-2 rounded-md focus:outline-0 focus:border-primary transition"
            onChange={(e) =>
              setNewUserData({ ...newUserData, fullName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col my-2 items-start w-full">
          <label htmlFor="email">
            Email <sup className="text-red-600">*</sup>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={newUserData.email || ""}
            className="w-full bg-neutral-50 text-black border-2 border-neutral-50 border-b-primary p-2 rounded-md focus:outline-0 focus:border-primary transition"
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
        <div className="flex flex-col my-2 items-start w-full">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            placeholder="Enter a new password if you want to change your old one"
            id="newPassword"
            name="newPassword"
            className="w-full bg-neutral-50 text-black border-2 border-neutral-50 border-b-primary p-2 rounded-md focus:outline-0 focus:border-primary transition"
            minLength="6"
            value={newUserData?.newPassword || ""}
            onChange={(e) =>
              setNewUserData({ ...newUserData, newPassword: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col my-2 items-start w-full">
          <label htmlFor="oldPassword">
            Old Password <sup className="text-red-600">*</sup>
          </label>
          <input
            type="password"
            placeholder="To make sure it's really you"
            id="oldPassword"
            name="oldPassword"
            required
            className="w-full bg-neutral-50 text-black border-2 border-neutral-50 border-b-primary p-2 rounded-md focus:outline-0 focus:border-primary transition"
          />
          {errorMode === "INVALID_PASSWORD" && (
            <label htmlFor="email" className="text-red-600 text-sm">
              Old password is invalid
            </label>
          )}
        </div>
        <div className="flex mt-4 justify-end w-full">
          <button
            type="submit"
            className={
              "px-3 py-2 rounded-lg drop-shadow-sm text-neutral-50 transition duration-300 " +
              (isChanged
                ? "bg-primary hover:bg-primaryDark "
                : "bg-neutral-400")
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
    <div className="flex flex-col bg-neutral-50 rounded-md drop-shadow-md items-center p-4 justify-between text-lg font-bold text-primary mb-4">
      <span className="cursor-default w-1/2">Preferences</span>
      <form
        className="flex flex-col w-full items-center text-md font-normal text-neutral-600"
        onSubmit={handlePreferencesSubmit}
      >
        <div className="flex my-2 justify-between w-1/2">
          <label htmlFor="allowPeerInvite">
            Allow other peers to invite you
          </label>
          <input
            type="checkbox"
            id="allowPeerInvite"
            name="allowPeerInvite"
            checked={newPreferences?.allowPeerInvite || false}
            value="true"
            className="bg-neutral-50 text-black border-2 border-neutral-50 border-b-primary p-2 rounded-md focus:outline-0 focus:border-primary transition"
            onChange={() =>
              setNewPreferences({
                ...newPreferences,
                allowPeerInvite: !newPreferences.allowPeerInvite,
              })
            }
          />
        </div>
        <div className="flex mt-4 justify-end w-1/2">
          <button
            type="submit"
            className={
              "px-3 py-2 rounded-lg drop-shadow-sm text-neutral-50 transition duration-300 " +
              (isChanged
                ? "bg-primary hover:bg-primaryDark "
                : "bg-neutral-400")
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

  const handleClickBack = () => {
    router.back()
  }

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
    console.log(res)
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
    <section className="p-6 flex flex-grow h-full flex-col overflow-y-auto">
      <div className="flex bg-neutral-50 rounded-md drop-shadow-md items-center p-4 justify-between text-xl font-bold text-primary mb-4">
        <div className="flex items-center gap-4">
          <button onClick={handleClickBack}>
            <FaArrowLeft />
          </button>
          <span className="cursor-default">Settings</span>
        </div>
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
