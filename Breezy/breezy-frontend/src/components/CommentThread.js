"use client";
import { useState } from "react";
import { useTranslation } from "@/app/lib/TranslationProvider";
export default function CommentThread({ comment, onReply }) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const { t } = useTranslation();
  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(comment._id, replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="ml-4 mt-2 border-l pl-4">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {comment.user?.avatar ? (
            <img src={comment.user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="block w-full h-full" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-black">
            {comment.user?.displayName || comment.user?.username}
          </div>
          <div className="text-xs text-gray-500">@{comment.user?.username}</div>
          <div className="text-black text-sm">{comment.text}</div>
          <div className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
          </div>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-xs text-blue-500 mt-1"
          >
            {t("Répondre")}
          </button>
          {showReplyInput && (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm text-gray-800"
                placeholder="Votre réponse..."
              />
              <button onClick={handleReply} className="bg-blue-500 text-white rounded px-2 py-1 text-sm">
                {t("Envoyer")}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Réponses récursives */}
      {comment.replies?.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply, idx) => (
            <CommentThread key={idx} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}
