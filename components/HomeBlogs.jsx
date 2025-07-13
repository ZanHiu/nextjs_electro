import React , { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import LaunchIcon from '@mui/icons-material/Launch';

const HomeBlogs = () => {
  const { homeBlogs, router } = useAppContext();
  const [showAll, setShowAll] = useState(false);
  const blogsToShow = showAll ? homeBlogs.slice(0, 10) : homeBlogs.slice(0, 5);

  const handleToggleShow = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    
    setTimeout(() => {
      if (newShowAll) {
        const buttonElement = document.querySelector('#blog-toggle-button');
        if (buttonElement) {
          buttonElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      } else {
        const titleElement = document.querySelector('#blogs-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  };

  return (
    <div className="mt-14 pb-14">
      <div className="flex flex-col items-center mb-8" id="blogs-title">
        <p className="text-3xl font-medium">Bài viết mới nhất</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 pb-8 w-full">
        {blogsToShow.map((blog, index) => (
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
              <button 
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition group"
              >
                Đọc ngay
                <LaunchIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {homeBlogs.length > 0 && (
        <div className="flex justify-center">
          <button 
            id="blog-toggle-button"
            onClick={handleToggleShow} 
            className="px-8 py-2 mb-16 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
          >
            {showAll ? "Ẩn bớt" : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeBlogs;
