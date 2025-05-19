import React from "react";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HomeBlogs = () => {
  const { homeBlogs, blogs, router } = useAppContext();

  return (
    <div className="mt-14 pb-14">
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-medium">Latest Blogs</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 pb-8 w-full">
        {homeBlogs.map((blog, index) => (
          <div key={blog._id || index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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
              <button 
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition group"
              >
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

      {homeBlogs.length > 0 && (
        <div className="flex justify-center">
          <button 
            onClick={() => router.push('/all-blogs')} 
            className="px-6 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
          >
            View All Blogs
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeBlogs;
