import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/format";
import CommentItem from "./CommentItem";

const CommentSection = ({ targetId, type = 'product' }) => {
  const { user, getToken, comments, fetchComments, postComment, updateComment, deleteComment } = useAppContext();
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const commentRef = useRef(null);

  useEffect(() => {
    fetchComments(targetId, type);
  }, [targetId, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Bạn cần đăng nhập!");
    if (!content.trim()) return toast.error("Vui lòng nhập nội dung bình luận!");

    try {
      const token = await getToken();
      await postComment(targetId, type, content.trim(), token, replyingTo?._id);
      setContent("");
      setReplyingTo(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleUpdate = async (commentId) => {
    if (!content.trim()) return toast.error("Vui lòng nhập nội dung bình luận!");

    try {
      const token = await getToken();
      await updateComment(commentId, content.trim(), token);
      setContent("");
      setEditingComment(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

    try {
      const token = await getToken();
      await deleteComment(commentId, token);
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setEditingComment(null);
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setContent(comment.content);
    setReplyingTo(null);
    if (commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancel = () => {
    setContent("");
    setReplyingTo(null);
    setEditingComment(null);
  };

  return (
    <div className="bg-white rounded-lg w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Bình luận ({comments.length})
        </h3>
      </div>

      {user ? (
        <form onSubmit={editingComment ? (e) => { e.preventDefault(); handleUpdate(editingComment._id); } : handleSubmit} className="mb-6">
          {(replyingTo || editingComment) && (
            <div className="mb-3 p-2 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-600">
                  {editingComment ? "Chỉnh sửa bình luận" : `Trả lời ${replyingTo?.userId?.name}`}
                </span>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
          <textarea
            ref={commentRef}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={replyingTo ? "Nhập trả lời của bạn..." : "Nhập bình luận của bạn..."}
            rows={3}
          />
          <button
            className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            type="submit"
            disabled={!content.trim()}
          >
            {editingComment ? "Cập nhật" : replyingTo ? "Trả lời" : "Bình luận"}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-500 mb-6">Bạn cần đăng nhập để bình luận.</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem 
            key={comment._id} 
            comment={comment}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserId={user?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
