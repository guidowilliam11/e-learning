import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { LuHeart, LuMessageSquare, LuEye } from 'react-icons/lu'

dayjs.extend(relativeTime)

// One row per post, like a GitHub Discussions list: who and when, the question, its tags, then counts.
export default function ForumPost({ id, image, author, date, title, description, tags, views, likes, comments }) {
  const initials = (author || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <li>
      <Link href={`/forum/${id}`} className='flex gap-4 p-5 group hover:bg-page/60'>
        <span className='grid text-xs font-semibold rounded-full size-9 shrink-0 place-items-center bg-accent-wash text-accent' aria-hidden>
          {initials}
        </span>
        <div className='flex-1 min-w-0'>
          <p className='text-xs text-ink-3'>
            <span className='font-medium text-ink-2'>{author}</span> · <time dateTime={date} title={dayjs(date).format('D MMM YYYY, HH:mm')}>{dayjs(date).fromNow()}</time>
          </p>
          <h3 className='mt-1 font-semibold leading-snug group-hover:text-accent'>{title}</h3>
          {description && <p className='mt-1 text-sm text-ink-2 line-clamp-2'>{description}</p>}
          <div className='flex flex-wrap items-center gap-2 mt-3'>
            {tags.map((tag) => (
              <span key={tag} className='px-2 py-0.5 text-xs font-medium rounded bg-page text-ink-2 border border-line'>{tag}</span>
            ))}
            <span className='flex items-center gap-4 ml-auto text-xs text-ink-3 tnum'>
              <span className='flex items-center gap-1' title='Likes'><LuHeart size={14} aria-hidden />{(likes || 0).toLocaleString()}<span className='sr-only'> likes</span></span>
              <span className='flex items-center gap-1' title='Comments'><LuMessageSquare size={14} aria-hidden />{(comments || 0).toLocaleString()}<span className='sr-only'> comments</span></span>
              <span className='flex items-center gap-1' title='Views'><LuEye size={14} aria-hidden />{(views || 0).toLocaleString()}<span className='sr-only'> views</span></span>
            </span>
          </div>
        </div>
        {image && <img src={image} alt='' className='self-start object-cover w-28 border rounded-md aspect-[4/3] shrink-0 border-line' />}
      </Link>
    </li>
  )
}
