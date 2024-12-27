'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '../components/sidebar'
import TopBar from '../components/topbar'
import { ToastWrapper } from '@/libs/ToastWrapper'
import { createTheme, ThemeProvider } from '@mui/material'
import { ConversationContextProvider } from "@/contexts/conversationContext";

export default function ConditionalLayout({ children }) {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: 'Inter',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Inter',
            textTransform: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            fontFamily: 'Inter',
          },
        },
      },
    },
  })

  const pathname = usePathname()

  // Define routes to exclude from the layout
  const excludedRoutes = ['/login', '/register', '/call/.']

  const isCurrentRouteExcluded = () => {
    let result = false
    excludedRoutes.forEach(route => {
      let regex = new RegExp(route)
      if (regex.test(pathname)) {
        result = true
      }
    })
    return result 
  }

  // If the current route is excluded, render only the children

  // Default layout for other routes
  return (
    <ThemeProvider theme={theme}>
      <ConversationContextProvider>
        {isCurrentRouteExcluded() ? (
          children
        ) : (
          <div className='flex font-inter'>
            <Sidebar />
            <div className='flex flex-col flex-grow h-screen'>
              <TopBar />
              <main className='flex-grow overflow-y-auto p-4 bg-gray-100 h-[90%] font-inter'>
                {children}
                <ToastWrapper />
              </main>
            </div>
          </div>
        )}
      </ConversationContextProvider>
    </ThemeProvider>
  )
}
