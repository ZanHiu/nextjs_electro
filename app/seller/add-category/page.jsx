"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/common/Loading";
import Footer from "@/components/seller/Footer";

const AddCategory = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [views, setViews] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("views", views);

    for (let i = 0; i < files.length; i++) {
      formData.append(`images`, files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName('');
        setDescription('');
        setViews('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      {loading ? <Loading /> : (
        <form onSubmit={handleSubmit} className="w-full md:p-10 p-4 space-y-5 max-w-lg">
          <h1 className="text-2xl font-semibold mb-6">Thêm danh mục</h1>
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="category-name">
              Tên danh mục
            </label>
            <input
              id="category-name"
              type="text"
              placeholder="Nhập tên danh mục"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div>
            <p className="text-base font-medium">Ảnh danh mục</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {[...Array(4)].map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }} type="file" id={`image${index}`} hidden />
                  <Image
                    key={index}
                    className="max-w-24 cursor-pointer"
                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                    alt=""
                    width={100}
                    height={100}
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <label
              className="text-base font-medium"
              htmlFor="category-description"
            >
              Mô tả danh mục
            </label>
            <textarea
              id="category-description"
              rows={4}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
              placeholder="Nhập mô tả danh mục"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="views">
              Lượt xem
            </label>
            <input
              id="views"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setViews(e.target.value)}
              value={views}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 disabled:bg-gray-400"
          >
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </form>
      )}
      <Footer />
    </div>
  );
};

export default AddCategory;
