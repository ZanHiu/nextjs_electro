"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
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
        toast.success("Blog added successfully!");
        await fetchHomeBlogs(); // Fetch updated blogs
        router.push("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Add New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Blog Title</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Content</label>
          <Editor
            value={formData.content}
            onChange={handleContentChange}
            className="h-60 overflow-y-auto"
          />
        </div>

        <div>
          <label className="block mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            required
          />
          {preview && (
            <div className="mt-4">
              <Image
                src={preview}
                alt="Preview"
                width={400}
                height={300}
                className="rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
