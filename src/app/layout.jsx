import './globals.css'
import ConditionalLayout from '../components/ConditionalLayout'

export const metadata = {
  title: '~ ZEAL.',
  description: 'Integrated Online Learning Platform',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
