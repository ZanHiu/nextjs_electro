"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/common/Loading";
import Footer from "@/components/seller/Footer";

const AddAttribute = () => {
  const { getToken } = useAppContext();

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attributes/add`, {
        name: name.trim(),
        value: value.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (data.success) {
        toast.success(data.message);
        setName('');
        setValue('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      {loading ? <Loading /> : (
        <form onSubmit={handleSubmit} className="w-full md:p-10 p-4 space-y-5 max-w-lg">
          <h1 className="text-2xl font-semibold mb-6">Thêm thuộc tính</h1>
          
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="attribute-name">
              Tên thuộc tính
            </label>
            <input
              id="attribute-name"
              type="text"
              placeholder="Ví dụ: Màu sắc, Kích thước, Dung lượng..."
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="attribute-value">
              Giá trị thuộc tính
            </label>
            <input
              id="attribute-value"
              type="text"
              placeholder="Ví dụ: Đỏ, XL, 256GB..."
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setValue(e.target.value)}
              value={value}
              required
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-800">
            <p className="text-sm">
              <strong>Lưu ý:</strong> Thuộc tính sẽ được lưu riêng lẻ và có thể tái sử dụng cho nhiều sản phẩm khác nhau.
            </p>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 disabled:bg-gray-400"
          >
            {loading ? "Đang thêm..." : "Thêm thuộc tính"}
          </button>
        </form>
      )}
      <Footer />
    </div>
  );
};

export default AddAttribute;