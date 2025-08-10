"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppContext } from "@/context/AppContext";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import axios from "axios";

const getInitialPage = () => {
  if (typeof window === "undefined") return 1;
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('page')) || 1;
};

const AllBlogs = () => {
  const { router } = useAppContext();
  const nextRouter = useRouter();
  
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => getInitialPage());
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 8
  });
  const [loading, setLoading] = useState(false);

  // Cập nhật URL khi page thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const query = params.toString();
    nextRouter.replace(`/all-blogs${query ? `?${query}` : ''}`, { scroll: false });
  }, [currentPage, nextRouter]);

  // Fetch blogs khi page thay đổi
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/list`, {
          params: {
            page: currentPage,
            limit: 8
          }
        }
      );
      if (response?.data.success) {
        setBlogs(response.data.blogs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  // Khi URL thay đổi (user nhập tay hoặc reload/back/forward), đồng bộ lại state
  useEffect(() => {
    const syncPageFromUrl = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', syncPageFromUrl);
    return () => window.removeEventListener('popstate', syncPageFromUrl);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}
        
        {/* Blogs Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12 pb-14 w-full">
              {blogs.map((blog, index) => (
                <BlogCard key={blog._id || index} blog={blog} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={pagination.current}
              totalPages={pagination.pages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
            />
          </>
        )}
        
        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-20 w-full">
            <p className="text-gray-500 text-lg">Không có bài viết nào</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllBlogs;