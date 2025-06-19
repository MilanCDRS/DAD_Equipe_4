export default function Post({ post }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6">
      <div className="flex gap-3 items-center mb-2">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
          {post.user?.avatarUrl
            ? <img src={post.user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            : <span className="block w-full h-full" />}
        </div>
        <div>
          <div className="font-bold text-black">{post.user?.displayName || "Utilisateur"}</div>
          <div className="text-gray-600 text-sm">@{post.user?.username || "inconnu"}</div>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString("fr-FR") : ""}
        </div>
      </div>
      <div className="mb-2 text-base text-black">
        {post.content}
      </div>
      {post.image && (
        <div className="mb-2 rounded-xl overflow-hidden">
          <img src={post.image} alt="post" className="w-full max-h-80 object-cover" />
        </div>
      )}
      <div className="flex gap-6 pt-2 text-gray-800">
        <div>💬 {post.comments || 0}</div>
        <div>❤️ {post.likes || 0}</div>
      </div>
    </div>
  );
}
