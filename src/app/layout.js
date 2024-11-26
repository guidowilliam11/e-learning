import './globals.css'
import Sidebar from '../components/sidebar'
import TopBar from '../components/topbar'
import { ToastWrapper } from '@/libs/ToastWrapper'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <div className='flex'>
          <Sidebar />
          <div className='flex flex-col flex-grow h-screen'>
            <TopBar />
            <main className='flex-grow overflow-y-auto p-4 bg-gray-100 h-[90%] font-inter'>
              {children}
              <ToastWrapper />
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
