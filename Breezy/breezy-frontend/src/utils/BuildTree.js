export function buildCommentTree(comments) {
  const map = {};
  const roots = [];

  comments.forEach((comment) => {
    map[comment._id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentCommentId) {
      const parent = map[comment.parentCommentId];
      if (parent) {
        parent.replies.push(map[comment._id]);
      }
    } else {
      roots.push(map[comment._id]);
    }
  });

  return roots;
}