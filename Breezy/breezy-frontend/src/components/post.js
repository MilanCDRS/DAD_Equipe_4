"use client";
import { useState } from "react";
import axios from "axios";
import PostComments from "./postComments";

export default function Post({ post, currentUser }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

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

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6">
      {/* Header utilisateur */}
      <div className="flex gap-3 items-center mb-2">
        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
          {post.user?.avatarUrl ? (
            <img src={post.user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="block w-full h-full" />
          )}
        </div>
        <div>
          <div className="font-bold text-black">
            {post.user?.displayName || post.user?.username || "Utilisateur"}
          </div>
          <div className="text-gray-600 text-sm">@{post.user?.username || "inconnu"}</div>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString("fr-FR") : ""}
        </div>
      </div>

      {/* Contenu du post */}
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

      {/* Actions like/comment */}
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
          💬 <span>Commentaires</span>
        </button>
      </div>

      {/* Zone des commentaires */}
      {showComments && (
        <div className="mt-4">
          <PostComments postId={post._id} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}
