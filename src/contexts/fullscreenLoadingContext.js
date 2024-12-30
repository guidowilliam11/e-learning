"use client"

import Spinner from "@/components/Spinner"
import { createContext, useContext, useState } from "react"

const FullscreenLoadingContext = createContext(null)

export const FullscreenLoadingContextProvider = ({ children }) => {

  const [isFullScreenLoading, setIsFullscreenLoading] = useState(false)

  return (
    <FullscreenLoadingContext.Provider
      value={{
        isFullScreenLoading,
        setIsFullscreenLoading
      }}
    >
      {
        isFullScreenLoading ? (
          <div
            className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-neutral-900/50"
          >
            <div
              className="bg-neutral-50 rounded-lg drop-shadow-md p-5 flex justify-center"
            >
              <Spinner className="w-1/3 h-1/3" />
            </div>
          </div>
        ) : null
      }
      {children}
    </FullscreenLoadingContext.Provider>
  )
}

export const useFullscreenLoadingContext = () => {
  return useContext(FullscreenLoadingContext)
}