"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Vui lòng nhập email của bạn");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/email/subscribe`,
        { email: email.trim() }
      );

      if (data.success) {
        toast.success(data.message);
        setEmail(""); // Reset form
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Lỗi đăng ký newsletter:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
        Đăng ký ngay để được giảm giá 10%
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8">
        Nhận thông tin về sản phẩm mới và mã giảm giá đặc biệt
      </p>
      <form onSubmit={handleSubmit} className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12">
        <input
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading}
          className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
