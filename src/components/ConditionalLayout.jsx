"use client"

import { usePathname } from "next/navigation"
import Sidebar from "../components/sidebar"
import TopBar from "../components/topbar"
import { ToastWrapper } from "@/libs/ToastWrapper"
import { ThemeProvider } from "@mui/material"
import { ConversationContextProvider } from "@/contexts/conversationContext"
import { FullscreenLoadingContextProvider } from "@/contexts/fullscreenLoadingContext"
import { SessionProvider } from "next-auth/react"
import MUITheme from "@/libs/MUITheme"

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()

  const excludedRoutes = ["/login", "/register", "/call/."]

  const isCurrentRouteExcluded = () => {
    let result = false
    excludedRoutes.forEach((route) => {
      let regex = new RegExp(route)
      if (regex.test(pathname)) {
        result = true
      }
    })
    return result
  }

  return (
    <SessionProvider>
      <ThemeProvider theme={MUITheme}>
        <FullscreenLoadingContextProvider>
          <ConversationContextProvider>
            {isCurrentRouteExcluded() ? (
              <>
                {children}
                <ToastWrapper />
              </>
            ) : (
              <div className="flex font-inter">
                <Sidebar />
                <div className="flex flex-col flex-grow h-screen">
                  <TopBar />
                  <main className="flex-grow overflow-y-auto p-4 bg-gray-100 h-[90%] font-inter">
                    {children}
                    <ToastWrapper />
                  </main>
                </div>
              </div>
            )}
          </ConversationContextProvider>
        </FullscreenLoadingContextProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
