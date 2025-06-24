import Image from "next/image";
import { formatDateTime } from "@/utils/format";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const CommentItem = ({
  comment,
  isReply = false,
  onReply,
  onEdit,
  onDelete,
  currentUserId
}) => {
  const avatarUrl = comment.userId?.imageUrl || "/default-avatar.png";
  const time = comment.createdAt ? formatDateTime(comment.createdAt) : "";
  const isCurrentUserComment = currentUserId && (comment.userId?._id === currentUserId);

  return (
    <div className={`${isReply ? 'ml-12 mt-2' : 'mb-4'}`}>
      <div className="flex items-start gap-3">
        <Image
          src={avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border"
          width={32}
          height={32}
        />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-800">
                {comment.userId?.name || "Ẩn danh"}
              </span>
              <span className="text-xs text-gray-400">{time}</span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {!isReply && (
              <button
                onClick={() => onReply(comment)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Trả lời
              </button>
            )}
            {isCurrentUserComment && (
              <>
                <button
                  onClick={() => onEdit(comment)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  <EditOutlinedIcon sx={{ fontSize: 20 }} />
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                </button>
              </>
            )}
          </div>
          {!isReply && comment.replies?.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  isReply={true}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
