"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { assets } from "@/assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Editor from "react-simple-wysiwyg";
import { useParams } from "next/navigation";

const EditBlog = () => {
  const { id } = useParams();
  const { getToken, fetchBlogData, router, blogs } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    image: null,
    slug: "",
  });
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetchBlogData();
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && blogs.length > 0) {
      const blog = blogs.find((b) => b._id === id);
      if (blog) {
        setFormData({
          name: blog.name || "",
          content: blog.content || "",
          slug: blog.slug || "",
          image: null,
        });
        setExistingImage(blog.image && blog.image[0] ? blog.image[0] : null);
      }
    }
  }, [id, blogs, isLoading]);

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
      if (formData.image) {
        formDataToSend.append("images", formData.image);
      }
      if (existingImage) {
        formDataToSend.append("existingImage", existingImage);
      }

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/edit/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        await fetchBlogData();
        toast.success("Cập nhật bài viết thành công");
        router.push("/all-blogs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 py-16 flex justify-center">
          <p className="text-gray-500">Đang tải...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={handleSubmit} className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Sửa{" "}
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
            />
            {(preview || existingImage) && (
              <div className="mt-4">
                <Image
                  src={preview || existingImage}
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
            Cập nhật bài viết
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

export default EditBlog;