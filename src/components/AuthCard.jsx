'use client'

import Link from 'next/link'

// Centred form on a plain page. The only ornament is a corner of the focus graph,
// in two places, faint and fading out toward the form.
const COLS = 26
const ROWS = 12
const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
  const v = Math.sin(i * 1.7) * 0.5 + Math.sin(i * 0.23) * 0.6
  return v > 0.7 ? 2 : v > 0.35 ? 1 : 0
})
const TONE = ['#ECECEF', '#FBE6CC', '#F8D3A4']

const Corner = ({ className, mask }) => (
  <div
    aria-hidden
    className={`absolute grid gap-[4px] pointer-events-none ${className}`}
    style={{ gridTemplateColumns: `repeat(${COLS}, 12px)`, gridAutoRows: '12px', WebkitMaskImage: mask, maskImage: mask }}
  >
    {cells.map((t, i) => <span key={i} className='rounded-[3px]' style={{ background: TONE[t] }} />)}
  </div>
)

export default function AuthCard({ title, subtitle, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className='relative grid min-h-screen px-4 overflow-hidden place-items-center bg-page font-inter text-ink'>
      <Corner className='top-0 left-0' mask='linear-gradient(135deg, #000 10%, transparent 60%)' />
      <Corner className='bottom-0 right-0' mask='linear-gradient(315deg, #000 10%, transparent 60%)' />

      <div className='relative w-full max-w-[400px]'>
        <Link href='/' className='block mb-6 text-2xl font-bold tracking-tight text-center'>zeal<span className='text-focus'>.</span></Link>
        <div className='p-8 bg-white border shadow-sm rounded-card border-line'>
          <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
          {subtitle && <p className='mt-1.5 text-sm text-ink-2'>{subtitle}</p>}
          <div className='mt-6'>{children}</div>
        </div>
        <p className='mt-6 text-sm text-center text-ink-2'>
          {footerText}{' '}
          <Link href={footerLink} className='font-medium text-accent hover:underline'>{footerLinkText}</Link>
        </p>
      </div>
    </div>
  )
}
