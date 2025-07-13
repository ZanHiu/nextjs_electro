"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import BlogCard from "@/components/BlogCard";

const AllBlogs = () => {
  const { blogs, router } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex justify-between items-center w-full pt-12">
          <div className="flex flex-col">
            <p className="text-2xl font-medium">Tất cả bài viết</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
          <button
            onClick={() => router.push("/add-blog")}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
          >
            <span>Thêm bài viết</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12 pb-14 w-full">
          {blogs.map((blog, index) => (
            <BlogCard key={blog._id || index} blog={blog} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllBlogs;
