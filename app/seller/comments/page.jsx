"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/common/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/format";
import { Tooltip } from "react-tooltip";

const CommentList = () => {
  const { router, getToken, user } = useAppContext();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerComments = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/seller`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setComments(data.comments);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchSellerComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerComments();
    }
  }, [user, getToken]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h1 className="text-2xl font-semibold mb-6">Quản lý bình luận</h1>
        <div className="flex flex-col items-center w-full rounded-md bg-white border border-gray-500/20">
          <div className="overflow-x-auto w-full">
            <table className="table-fixed w-full">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-1/4 px-4 py-3 font-medium truncate">Người dùng</th>
                <th className="w-1/3 px-4 py-3 font-medium truncate">Nội dung</th>
                <th className="w-1/6 px-4 py-3 font-medium truncate">Loại</th>
                <th className="w-1/6 px-4 py-3 font-medium truncate">Ngày</th>
                <th className="w-1/6 px-4 py-3 font-medium truncate max-sm:hidden">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {comments.map((comment) => (
                <tr key={comment._id} className="border-t border-gray-500/20">
                  <td className="px-4 py-3 truncate" data-tooltip-id="comment-tooltip" data-tooltip-content={comment.userId?.name}>
                    {comment.userId?.name}
                  </td>
                  <td className="px-4 py-3 truncate" data-tooltip-id="comment-tooltip" data-tooltip-content={comment.content}>
                    {comment.content}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      comment.type === 'product' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {comment.type === 'product' ? 'Sản phẩm' : 'Blog'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatDate(comment.createdAt)}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Tooltip id="comment-tooltip" place="top" effect="solid" multiline={true} />
          </div>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default CommentList; 