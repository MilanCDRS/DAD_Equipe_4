"use client";
import { useState } from 'react';

export default function CommentItem({ comment, onReply, currentUser }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText("");
      setShowReply(false);
    }
  };

  return (
    <div className="ml-4 mt-2">
      <div className="p-2 border rounded bg-gray-100">
        <div className="text-sm font-semibold">{comment.user.displayName || comment.user.username}</div>
        <div className="text-sm text-gray-800">{comment.text}</div>
        <button onClick={() => setShowReply(!showReply)} className="text-xs text-blue-500 hover:underline mt-1">
          Répondre
        </button>

        {showReply && (
          <div className="mt-1 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 border px-2 py-1 text-sm"
              placeholder="Ta réponse..."
            />
            <button onClick={handleReply} className="text-sm bg-blue-500 text-white px-2 rounded">Envoyer</button>
          </div>
        )}
      </div>

      {/* Réponses récursives */}
      {comment.replies?.map((rep) => (
        <CommentItem
          key={rep._id}
          comment={rep}
          onReply={onReply}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}
