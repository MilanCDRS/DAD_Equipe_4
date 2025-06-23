import { useState } from "react";
import axios from "axios";

export default function Post({ post, currentUser }) {
  if (!post) return null;
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const alreadyLiked = currentUser && likes.includes(currentUser.username);

  const handleLike = async () => {
    if (!currentUser) return alert("Connecte-toi pour liker");
    setIsLiking(true);
    try {
      const res = await axios.put(`/api/public/posts/${post._id}/like`, {
        username: currentUser.username,
      });
      setLikes(res.data.likes);
    } catch {
      alert("Erreur lors du like !");
    }
    setIsLiking(false);
  };

  // PATCH ICI: toujours envoyer un displayName correct au backend
  const handleAddComment = async () => {
    if (!currentUser) return alert("Connecte-toi pour commenter");
    if (!commentText.trim()) return;
    setIsCommenting(true);
    try {
      const res = await axios.post(`/api/public/posts/${post._id}/comments`, {
        user: {
          username: currentUser.username,
          displayName: currentUser.displayName || currentUser.name || currentUser.username, // PATCH
          avatarUrl: currentUser.avatarUrl || ""
        },
        text: commentText,
      });
      setComments([...comments, res.data]);
      setCommentText("");
    } catch {
      alert("Erreur lors de l'ajout du commentaire !");
    }
    setIsCommenting(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6">
      <div className="flex gap-3 items-center mb-2">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
          {post.user?.avatarUrl ? (
            <img
              src={post.user.avatarUrl}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="block w-full h-full" />
          )}
        </div>
        <div>
          <div className="font-bold text-black">{post.user?.displayName || post.user?.username || "Utilisateur"}</div>
          <div className="text-gray-600 text-sm">@{post.user?.username || "inconnu"}</div>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("fr-FR")
            : ""}
        </div>
      </div>
      <div className="mb-2 text-base text-black">{post.content}</div>
      {post.image && post.image.length > 10 && (
        <div className="mb-2 rounded-xl overflow-hidden bg-white">
          <img
            src={
              post.image.startsWith("data:")
                ? post.image
                : `data:image/*;base64,${post.image}`
            }
            alt="post"
            className="w-full max-h-80 object-contain bg-white"
            style={{ display: "block", margin: "0 auto" }}
          />
        </div>
      )}
      {/* Boutons Like & Commentaire */}
      <div className="flex gap-6 pt-2 text-gray-800 items-center">
        <button
          onClick={currentUser ? handleLike : undefined}
          disabled={isLiking}
          className={`flex items-center gap-1 ${
            alreadyLiked ? "text-red-500" : "text-gray-600"
          } focus:outline-none`}
        >
          {alreadyLiked ? "❤️" : "🤍"} <span>{likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-gray-600 focus:outline-none"
        >
          💬 <span>{comments.length}</span>
        </button>
      </div>
      {/* Section Commentaires */}
      {showComments && (
        <div className="mt-4">
          {/* Liste */}
          <div className="space-y-3 mb-3">
            {comments.length === 0 && (
              <div className="text-gray-400 text-sm">Aucun commentaire</div>
            )}
            {comments.map((com, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {com.user?.avatarUrl ? (
                    <img
                      src={com.user.avatarUrl}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="block w-full h-full" />
                  )}
                </div>
                <div className="flex-1">
                  {/* PATCH : nom d’utilisateur, puis fallback username */}
                  <div className="text-sm font-medium text-black">{com.user?.displayName || com.user?.username || "Utilisateur"}</div>
                  <div className="text-xs text-gray-500">@{com.user?.username}</div>
                  {/* PATCH : commentaire toujours noir */}
                  <div className="text-black text-sm">{com.text}</div>
                  <div className="text-xs text-gray-400">
                    {com.createdAt
                      ? new Date(com.createdAt).toLocaleDateString("fr-FR")
                      : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Formulaire ajout */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border rounded px-3 py-1 text-sm text-black"
              className="flex-1 border rounded px-3 py-1 text-sm"
              placeholder="Ajouter un commentaire…"
              disabled={isCommenting}
              maxLength={200}
            />
            <button
              onClick={handleAddComment}
              disabled={isCommenting || !commentText.trim()}
              className={`rounded px-3 py-1 text-white text-sm font-medium transition ${
                commentText.trim() && !isCommenting
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-100 text-blue-200 cursor-not-allowed"
              }`}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
