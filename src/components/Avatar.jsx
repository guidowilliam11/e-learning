import Image from 'next/image'

// A photo when the student uploaded one, otherwise their initials. The stock silhouette said nothing about who it was.
const isStock = (src) => !src || src.startsWith('/images/default-')

const Avatar = ({ name = '', src, size = 40, group = false, className = '' }) => {
  const initials = name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'
  if (!isStock(src)) {
    return <Image src={src} alt='' width={size} height={size} className={`rounded-full object-cover shrink-0 ${className}`} style={{ width: size, height: size }} />
  }
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center font-semibold ${group ? 'rounded-lg bg-focus-wash text-focus-ink' : 'rounded-full bg-accent-wash text-accent'} ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  )
}

export default Avatar
