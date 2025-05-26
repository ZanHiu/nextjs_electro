import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { formatPrice } from "@/utils/format";

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();

  return (
    <div
      onClick={() => {
        router.push("/product/" + product._id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-0.5 w-full cursor-pointer"
    >
      <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="group-hover:scale-105 transition object-contain w-4/5 h-4/5 md:w-full md:h-full mix-blend-multiply"
          width={800}
          height={800}
        />
        {product.price > product.offerPrice && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-medium rounded-lg">
              -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
            </span>
          </div>
        )}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
          <Image className="h-3 w-3" src={assets.heart_icon} alt="heart_icon" />
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">
        {product.name}
      </p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {product.description}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs">{4.5}</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Image
              key={index}
              className="h-3 w-3"
              src={
                index < Math.floor(4) ? assets.star_icon : assets.star_dull_icon
              }
              alt="star_icon"
            />
          ))}
        </div>
      </div>
      <p className="text-sm">
        {product.views} views
      </p>

      <div className="flex flex-col mt-1 w-full">
        <div className="flex items-center gap-3">
          {/* Giá khuyến mãi */}
          <div className="flex items-baseline">
            <span className="text-xl font-semibold text-gray-900">
              {formatPrice(product.offerPrice)}{currency}
            </span>
          </div>

          {/* Giá gốc */}
          {product.price > product.offerPrice && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}{currency}
              </span>
            </div>
          )}
        </div>

        {/* Thông tin thêm và nút mua */}
        <div className="flex items-center justify-between mt-2">
          <button className="w-full max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
            Buy now
          </button>
        </div>
      </div>

      {/* <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">
          {currency}
          {product.offerPrice}
        </p>
        <button className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
          Buy now
        </button>
      </div> */}
    </div>
  );
};

export default ProductCard;
