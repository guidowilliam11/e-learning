'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '../components/sidebar'
import TopBar from '../components/topbar'
import { ToastWrapper } from '@/libs/ToastWrapper'
import { ThemeProvider } from '@mui/material'
import MUITheme from '@/libs/MUITheme'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()

  const excludedRoutes = ['/login', '/register']
  return (
    <ThemeProvider theme={MUITheme}>
      {excludedRoutes.includes(pathname) ? (
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
    </ThemeProvider>
  )
}
