import Image from 'next/image'

export default function ForumPost({
  avatarSrc,
  author,
  date,
  content,
  tags,
  views,
  likes,
  comments,
}) {
  return (
    <div className='flex flex-grow gap-5 p-4 bg-white rounded-lg shadow-md'>
      <div className='w-full max-w-[180px] h-auto aspect-square bg-[#E5E7FB] rounded-md'></div>
      <div className='flex flex-col justify-between flex-grow'>
        <div>
          {/* Post Content */}
          <p className='mb-3 text-gray-700'>{content}</p>

          {/* Tags */}
          <div className='flex mb-4 space-x-2'>
            {tags.map((tag, index) => (
              <span
                key={index}
                className='text-xs bg-[#E5E7FB] text-gray-600 rounded-full px-3 py-1'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className='flex justify-between'>
          {/* Post Header */}
          <div className='flex items-center gap-3'>
            <Image
              src={avatarSrc}
              alt={`${author}`}
              width={36}
              height={36}
              className='bg-[#E5E7FB] rounded-full h-[36px] w-[36px]'
            />
            <div>
              <h3 className='text-sm font-semibold text-gray-800'>{author}</h3>
              <p className='text-xs text-gray-500'>{date}</p>
            </div>
          </div>

          {/* Post Footer */}
          <div className='flex items-center justify-between gap-6 text-sm text-gray-600'>
            <span>{views.toLocaleString()} Views</span>
            <span>{likes.toLocaleString()} Likes</span>
            <span>{comments.toLocaleString()} Comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}
