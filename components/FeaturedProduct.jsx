import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import LaunchIcon from '@mui/icons-material/Launch';

const products = [
  {
    id: 1,
    image: assets.feature_product_headphones,
    title: "Unparalleled Sound",
    description: "Experience crystal-clear audio with premium headphones.",
  },
  {
    id: 2,
    image: assets.feature_product_earphones,
    title: "Stay Connected",
    description: "Compact and stylish earphones for every occasion.",
  },
  {
    id: 3,
    image: assets.feature_product_laptop,
    title: "Power in Every Pixel",
    description: "Shop the latest laptops for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 md:px-14 px-4 pb-14">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {description}
              </p>
              <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                Buy now 
                <LaunchIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
