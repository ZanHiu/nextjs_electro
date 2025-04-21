"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/assets/assets";

const AllBlogs = () => {
  const { blogs, router } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
      <div className="flex justify-between items-center w-full pt-12">
          <div className="flex flex-col">
            <p className="text-2xl font-medium">All blogs</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
          <button 
            onClick={() => router.push('/add-blog')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
          >
            <span>Add Blog</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
          {blogs.map((blog, index) => (
            <div
              key={blog._id || index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
                <Image
                  src={blog.image[0]}
                  alt={blog.slug}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-3 line-clamp-2 hover:text-orange-600 transition">
                  {blog.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.content.substring(0, 100)}...
                </p>
                <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition group">
                  Read more
                  <Image
                    className="h-3 w-3 group-hover:translate-x-1 transition-transform"
                    src={assets.redirect_icon}
                    alt="Redirect Icon"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllBlogs;
