'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/format";

const BlogList = () => {
  const { router, getToken, user } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerBlog = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (data.success) {
        setBlogs(data.blogs);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerBlog();
    }
  }, [user]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h1 className="text-2xl font-semibold mb-6">Blogs Management</h1>
        <div className="flex flex-col items-center w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Blog</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Author</th>
                <th className="px-4 py-3 font-medium truncate">Date</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={blog.image[0]}
                        alt="blog Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">
                      {blog.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{blog.userId?.name}</td>
                  <td className="px-4 py-3">{formatDate(blog.date)}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(`/blog/${blog._id}`)} 
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default BlogList;
