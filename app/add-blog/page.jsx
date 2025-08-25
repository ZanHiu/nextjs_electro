"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { assets } from "@/assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Editor from "react-simple-wysiwyg";

const AddBlog = () => {
  const { fetchHomeBlogs, router, getToken } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    image: null,
    slug: "",
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      slug:
        name === "name" ? value.toLowerCase().replace(/\s+/g, "-") : prev.slug,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("images", formData.image);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/add`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Thêm bài viết thành công");
        await fetchHomeBlogs();
        router.push("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={handleSubmit} className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Thêm{" "}
            <span className="font-semibold text-orange-600">Bài viết</span>
          </p>
          <div className="space-y-3 max-w-sm mt-10">
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              name="name"
              placeholder="Tiêu đề"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="w-full">
              <Editor
                value={formData.content}
                onChange={handleContentChange}
                className="min-h-[120px] focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              />
            </div>
            <input
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Preview"
                  width={200}
                  height={150}
                  className="rounded border border-gray-500/30"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
          >
            Thêm bài viết
          </button>
        </form>
        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={assets.my_blog_image}
          alt="my_blog_image"
          width={403}
          height={356}
        />
      </div>
      <Footer />
    </>
  );
};

export default AddBlog;