import { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/format";

const BlogReview = ({ blogId }) => {
  const {
    user,
    getToken,
    reviews,
    fetchReviews,
    postReview,
    getReviewAmount,
    getReviewCount,
  } = useAppContext();

  const [value, setValue] = useState(0);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchReviews(blogId, "blog");
  }, [blogId, user?.id]);

  useEffect(() => {
    // Không cần set giá trị rating mặc định từ rating riêng nữa
    // if (user && ratings) {
    //   const myRating = ratings.find((r) => r.userId === (user.id || user._id));
    //   setValue(myRating ? myRating.value : 0);
    // } else {
    //   setValue(0);
    // }
  }, [user]); // ratings không còn là dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Bạn cần đăng nhập!");

    // Bắt buộc phải có cả số sao và nội dung bình luận
    if (value === 0 || !content.trim()) {
        toast("Vui lòng chọn sao và nhập bình luận.");
        return;
    }

    const token = await getToken();

    // Gửi review (bao gồm cả content và ratingValue)
    await postReview(blogId, "blog", content, value, token);

    setContent("");
    setValue(0);
  };

  return (
    <div className="mt-10 bg-white rounded-lg shadow p-6 w-full mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Đánh giá & Bình luận bài viết
        </h3>
        {/* Hiển thị số sao trung bình và tổng số lượt review */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-orange-500 font-bold text-lg">{(getReviewAmount(reviews) || 0).toFixed(1)} / 5</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Image
                key={star}
                src={star <= Math.round(getReviewAmount(reviews) || 0) ? assets.star_icon : assets.star_dull_icon}
                alt="star"
                className="h-5 w-5"
                width={20}
                height={20}
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm">({getReviewCount(reviews)} lượt đánh giá)</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setValue(star)}
                className="focus:outline-none"
              >
                <Image
                  src={star <= value ? assets.star_icon : assets.star_dull_icon}
                  alt={star <= value ? "star_icon" : "star_dull_icon"}
                  className="h-6 w-6"
                  width={24}
                  height={24}
                />
              </button>
            ))}
          </div>
        </div>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
          rows={3}
        />
        <button
          className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          type="submit"
          disabled={value === 0 && !content.trim()}
        >
          Gửi đánh giá & bình luận
        </button>
      </form>
      <ul className="space-y-4">
        {reviews.map(c => {
          // Lấy ratingValue trực tiếp từ review
          const reviewRatingValue = c.ratingValue || 0;
          const avatarUrl = c.userId?.imageUrl || "/default-avatar.png";
          let name;
          if (user && (c.userId?._id === user.id)) {
            name = "Bạn";
          } else {
            name = c.userId?.name || "Ẩn danh";
          }
          const time = c.createdAt ? formatDateTime(c.createdAt) : "";
          return (
            <li key={c._id} className="border-b pb-2 flex items-start gap-3">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border"
              />
              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-orange-600">{name}</span>
                    <span className="text-xs text-gray-400">{time}</span>
                  </div>
                  {/* Hiển thị số sao nếu review có ratingValue */}
                  {reviewRatingValue > 0 && (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Image
                          key={star}
                          src={star <= reviewRatingValue ? assets.star_icon : assets.star_dull_icon}
                          alt="star"
                          className="h-4 w-4"
                          width={16}
                          height={16}
                        />
                      ))}
                    </div>
                  )}
                  <span className="text-gray-700">{c.content}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BlogReview;
