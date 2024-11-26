'use client'

export default function AuthCard({
  title,
  children,
  footerText,
  footerLink,
  footerLinkText,
}) {
  return (
    <div className='flex items-center justify-center h-screen bg-gray-100 font-inter'>
      <div className='bg-white rounded-lg shadow-lg p-8 w-[400px]'>
        <h2 className='text-2xl font-semibold text-[#F2994A] mb-6 text-center'>
          {title}
        </h2>
        {children}
        <p className='mt-4 text-sm text-center text-gray-600'>
          {footerText}{' '}
          <a
            href={footerLink}
            className='text-[#F2994A] font-medium hover:underline'
          >
            {footerLinkText}
          </a>
        </p>
      </div>
    </div>
  )
}
