import Image from 'next/image';

export default function ForumPost({ avatarSrc, author, date, content, tags, views, likes, comments }) {
  return (
    <div className="flex flex-grow bg-white rounded-lg shadow-md p-4 gap-5">
      <div className="w-full max-w-[180px] h-auto aspect-square bg-[#E5E7FB] rounded-md"></div>
      <div className='flex-grow flex flex-col justify-between'>
        <div>
        {/* Post Content */}
        <p className="text-gray-700 mb-3">{content}</p>

        {/* Tags */}
        <div className="flex space-x-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-[#E5E7FB] text-gray-600 rounded-full px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
        </div>

        <div className='flex justify-between'>
          {/* Post Header */}
          <div className="flex items-center gap-3">
            <Image src={avatarSrc} alt={`${author}`} width={36} height={36} className="bg-[#E5E7FB] rounded-full h-[36px] w-[36px]" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{author}</h3>
              <p className="text-xs text-gray-500">{date}</p>
            </div>
          </div>

          {/* Post Footer */}
          <div className="flex justify-between items-center text-gray-600 text-sm gap-6">
            <span>{views.toLocaleString()} Views</span>
            <span>{likes.toLocaleString()} Likes</span>
            <span>{comments.toLocaleString()} Comments</span>
          </div>
        </div>
      </div>

    </div>
  );
}