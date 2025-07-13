import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { formatPrice } from "@/utils/format";
import axios from "axios";
import toast from "react-hot-toast";

const ProductCard = ({ product, onFavoriteRemoved, favoriteProductIds: propFavoriteProductIds }) => {
  const { currency, router, user, getToken, getProductReviewCount, getProductReviewAmount, favoriteProductIds, refreshFavoriteProducts } = useAppContext();
  const [isFavorite, setIsFavorite] = useState(favoriteProductIds.includes(product._id));

  useEffect(() => {
    setIsFavorite(favoriteProductIds.includes(product._id));
  }, [favoriteProductIds, product._id]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Vui lòng đăng nhập lại để thực hiện thao tác này');
        return;
      }

      if (isFavorite) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/remove/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        toast.success("Đã xóa khỏi danh sách yêu thích");
        setIsFavorite(false);
        if (onFavoriteRemoved) {
          onFavoriteRemoved();
        }
        if (refreshFavoriteProducts) refreshFavoriteProducts();
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/add`,
          { productId: product._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        toast.success("Đã thêm vào danh sách yêu thích");
        setIsFavorite(true);
        if (refreshFavoriteProducts) refreshFavoriteProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleProductClick = (e) => {
    // Chỉ điều hướng nếu click KHÔNG phải trên nút yêu thích
    if (!e.target.closest('.favorite-button')) {
      router.push("/product/" + product._id);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      onClick={handleProductClick}
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
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow-md transition-colors favorite-button ${
            isFavorite ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <Image
            className="h-3 w-3"
            src={isFavorite ? assets.heart_filled_icon : assets.heart_icon}
            alt="heart_icon"
          />
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">
        {product.name}
      </p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {product.description}
      </p>
      {getProductReviewCount(product._id) > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <p className="text-xs">{getProductReviewAmount(product._id).toFixed(1)}</p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Image
                  key={index}
                  className="h-3 w-3"
                  src={
                    index < Math.floor(getProductReviewAmount(product._id)) ? assets.star_icon : assets.star_dull_icon
                  }
                  alt="star_icon"
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">Chưa đánh giá</p>
      )}
      <p className="text-sm">
        {product.views} lượt xem
      </p>

      <div className="flex flex-col mt-1 w-full">
        <div className="flex items-center gap-3">
          {/* Giá khuyến mãi */}
          <div className="flex items-baseline">
            <span className="text-xl font-semibold text-orange-500">
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
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
