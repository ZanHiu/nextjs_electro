import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/format";
import { useSearchParams } from "next/navigation";

const ReviewSection = ({ productId }) => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const reviewRef = useRef(null);

  const {
    user,
    getToken,
    reviews,
    fetchReviews,
    postReview,
    getReviewAmount,
    getReviewCount,
    hasUserPurchasedProduct,
    checkUserProductPurchaseStatus,
  } = useAppContext();

  const [value, setValue] = useState(0);
  const [content, setContent] = useState("");
  const [myReviews, setMyReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetchReviews(productId, "product");
  }, [productId, user?.id]);

  useEffect(() => {
    if (user && productId) {
      getToken().then(token => {
        checkUserProductPurchaseStatus(productId, token);
      });
    } else {
      setMyReviews([]);
      setValue(0);
      setContent("");
      checkUserProductPurchaseStatus(productId, null);
    }
  }, [productId, user?.id, getToken]);

  useEffect(() => {
    if (user && reviews) {
      const userReviews = reviews.filter(r => r.userId === (user.id || user._id));
      setMyReviews(userReviews);
      if (orderId) {
        const reviewForOrder = userReviews.find(r => r.orderId === orderId);
        if (reviewForOrder) {
          setValue(reviewForOrder.ratingValue || 0);
          setContent(reviewForOrder.content || "");
          setEditingReviewId(reviewForOrder._id);
        }
      }
    } else {
      setMyReviews([]);
      setValue(0);
      setContent("");
      setEditingReviewId(null);
    }
  }, [reviews, user, orderId]);

  useEffect(() => {
    if (orderId && reviewRef.current) {
      setTimeout(() => {
        reviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Bạn cần đăng nhập!");
    if (!orderId) return toast.error("Không tìm thấy thông tin đơn hàng!");

    if (value === 0 || !content.trim()) {
      toast("Vui lòng chọn sao và nhập đánh giá.");
      return;
    }

    const token = await getToken();
    await postReview(productId, "product", content, value, token, orderId);

    setContent("");
    setValue(0);
    setEditingReviewId(null);
  };

  const handleEditClick = (review) => {
    setValue(review.ratingValue || 0);
    setContent(review.content || "");
    setEditingReviewId(review._id);
    if (reviewRef.current) {
      reviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setValue(0);
    setContent("");
    setEditingReviewId(null);
  };

  return (
    <div className="bg-white rounded-lg w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Đánh giá sản phẩm
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-lg">{getReviewAmount(reviews).toFixed(1)} / 5</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Image
                key={star}
                src={star <= Math.round(getReviewAmount(reviews)) ? assets.star_icon : assets.star_dull_icon}
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
      {user && hasUserPurchasedProduct && !editingReviewId && (
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
            placeholder="Nhập đánh giá của bạn..."
            rows={3}
          />
          <button
            className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            type="submit"
            disabled={value === 0 && !content.trim()}
          >
            Gửi đánh giá
          </button>
        </form>
      )}
      {editingReviewId && (
        <form onSubmit={handleSubmit} className="mb-6 bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-orange-600">Chỉnh sửa đánh giá</h4>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              Hủy
            </button>
          </div>
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
            placeholder="Nhập đánh giá của bạn..."
            rows={3}
          />
          <button
            className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            type="submit"
            disabled={value === 0 && !content.trim()}
          >
            Cập nhật đánh giá
          </button>
        </form>
      )}
      {!user && (
        <p className="text-center text-gray-500 mb-6">Bạn cần mua sản phẩm này để có thể đánh giá.</p>
      )}
      <ul className="space-y-4">
        {reviews
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(c => {
          const reviewRatingValue = c.ratingValue || 0;
          const avatarUrl = c.userId?.imageUrl || "/default-avatar.png";
          let name;
          if (user && (c.userId?._id === user.id)) {
            name = "Bạn";
          } else {
            name = c.userId?.name || "Ẩn danh";
          }
          const time = c.createdAt ? formatDateTime(c.createdAt) : "";
          const isCurrentUserReview = user && (c.userId?._id === user.id);
          return (
            <li 
              key={c._id} 
              className="border-b pb-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-gray-800">
                        {name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{time}</span>
                        {isCurrentUserReview && !editingReviewId && (
                          <button
                            onClick={() => handleEditClick(c)}
                            className="text-sm text-orange-500 hover:text-orange-600"
                          >
                            <Image src={assets.edit_icon} alt="edit_icon" className="h-4 w-4" width={16} height={16} />
                          </button>
                        )}
                      </div>
                    </div>
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
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReviewSection;
