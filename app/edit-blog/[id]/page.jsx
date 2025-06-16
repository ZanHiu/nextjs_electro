'use client'
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
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
    slug: ""
  });
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBlogData();
      const blog = blogs.find((b) => b._id === id);
      if (blog) {
        setFormData({
          name: blog.name,
          content: blog.content,
          slug: blog.slug
        });
        setExistingImage(blog.image[0]);
      }
    };
    fetchData();
  }, [id, blogs.length, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'name' ? value.toLowerCase().replace(/\s+/g, '-') : prev.slug
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('slug', formData.slug);
      if (formData.image) {
        formDataToSend.append('images', formData.image);
      }
      formDataToSend.append('existingImage', existingImage);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/edit/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        await fetchBlogData();
        toast.success('Blog updated successfully!');
        router.push('/all-blogs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Edit Blog</h1>
      
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
          />
          {(preview || existingImage) && (
            <div className="mt-4">
              <Image
                src={preview || existingImage}
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
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
