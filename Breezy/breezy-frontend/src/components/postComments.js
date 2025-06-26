import { useEffect, useState } from "react";
import axios from "axios";
import CommentItem from "./comments";
import { buildCommentTree } from "../utils/BuildTree";

export default function PostComments({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const res = await axios.get(`/api/public/comments/${postId}`);
    console.log("Commentaires reçus :", res.data);
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await axios.post(`/api/public/comments/${postId}`, {
      user: currentUser,
      text: newComment,
    }).then(res => console.log("Commentaire ajouté :", res.data));
    setNewComment("");
    fetchComments();
  };

  const handleReply = async (parentCommentId, text) => {
    await axios.post(`/api/public/comments/${postId}`, {
      user: currentUser,
      text,
      parentCommentId,
    });
    fetchComments();
  };

  const tree = buildCommentTree(comments);

  return (
    <div>
      <div className="mb-4">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border px-3 py-1 text-sm"
          placeholder="Ajouter un commentaire..."
        />
        <button onClick={handleAddComment} className="mt-2 bg-blue-500 text-white px-3 py-1 text-sm rounded">
          Commenter
        </button>
      </div>

      {tree.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onReply={handleReply}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}
