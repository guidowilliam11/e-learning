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
import { NotesContextProvider } from "@/contexts/notesContext"

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
            <NotesContextProvider>
              {isCurrentRouteExcluded() ? (
                <>
                  {children}
                  <ToastWrapper />
                </>
              ) : (
                <div className="flex font-inter bg-page text-ink">
                  <Sidebar />
                  <div className="flex flex-col flex-grow min-w-0 h-screen">
                    <TopBar />
                    <main className="flex-1 min-h-0 p-8 overflow-y-auto bg-page font-inter">
                      {children}
                      <ToastWrapper />
                    </main>
                  </div>
                </div>
              )}
            </NotesContextProvider>
          </ConversationContextProvider>
        </FullscreenLoadingContextProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
