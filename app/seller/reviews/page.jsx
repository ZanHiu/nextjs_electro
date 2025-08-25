"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/common/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/format";
import { Tooltip } from "react-tooltip";

const ReviewList = () => {
  const { router, getToken, user } = useAppContext();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerReviews = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/seller`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setReviews(data.reviews);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchSellerReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerReviews();
    }
  }, [user, getToken]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h1 className="text-2xl font-semibold mb-6">Quản lý đánh giá</h1>
        <div className="flex flex-col items-center w-full rounded-md bg-white border border-gray-500/20">
          <div className="overflow-x-auto w-full">
            <table className="table-fixed w-full">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-1/4 px-4 py-3 font-medium truncate">Người dùng</th>
                <th className="w-1/3 px-4 py-3 font-medium truncate">Nội dung</th>
                <th className="w-1/6 px-4 py-3 font-medium truncate">Đánh giá</th>
                <th className="w-1/6 px-4 py-3 font-medium truncate">Ngày</th>
                {/* <th className="w-1/6 px-4 py-3 font-medium truncate max-sm:hidden">Hành động</th> */}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {reviews.map((review) => (
                <tr key={review._id} className="border-t border-gray-500/20">
                  <td className="px-4 py-3 truncate" data-tooltip-id="review-tooltip" data-tooltip-content={review.userId?.name}>
                    {review.userId?.name}
                  </td>
                  <td className="px-4 py-3 truncate" data-tooltip-id="review-tooltip" data-tooltip-content={review.content}>
                    {review.content}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= review.ratingValue ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({review.ratingValue}/5)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatDate(review.createdAt)}</td>
                  {/* <td className="px-4 py-3 max-sm:hidden">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Xóa</span>
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          <Tooltip id="review-tooltip" place="top" effect="solid" multiline={true} />
          </div>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ReviewList; 