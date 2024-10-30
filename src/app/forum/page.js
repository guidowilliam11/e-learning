import ForumPost from '../../components/forumPost';

export default function Forum() {
  const posts = [
    {
      id: 1,
      avatarSrc: '/profile-icon.png', // Update with actual avatar URL or path
      author: "John Doe",
      date: "3 weeks ago",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      tags: ["AI", "Science", "Code"],
      views: 615324,
      likes: 36656,
      comments: 56,
    },
    {
      id: 2,
      avatarSrc: '/profile-icon.png', // Update with actual avatar URL or path
      author: "Jane Smith",
      date: "2 weeks ago",
      content: "Another example post content...",
      tags: ["Math", "Physics", "Research"],
      views: 123456,
      likes: 7890,
      comments: 23,
    },
    // Add more post objects as needed
  ];

  return (
    <div className="flex flex-col p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
      <input
          type="text"
          placeholder="Let's share what you want to discuss..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button className="ml-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Create Post
        </button>
      </div>

      {/* Posts List */}
      <div className="flex flex-col flex-grow space-y-6">
        {posts.map((post) => (
          <ForumPost
            key={post.id}
            avatarSrc={post.avatarSrc}
            author={post.author}
            date={post.date}
            content={post.content}
            tags={post.tags}
            views={post.views}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
      </div>
    </div>
  );
}