"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/product/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";
import axios from "axios";

const FavoriteProducts = () => {
  const { user, getToken } = useAppContext();
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const fetchFavoriteProducts = async () => {
    if (!user) return;
    
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Không có token xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        setFavoriteProducts(data.favorites);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách yêu thích");
    }
  };

  useEffect(() => {
    fetchFavoriteProducts();
  }, [user, getToken]);

  // Hàm này sẽ được truyền xuống ProductCard để cập nhật danh sách
  const handleProductRemoved = () => {
    fetchFavoriteProducts();
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <h2 className="text-2xl font-medium mb-4">Vui lòng đăng nhập để xem danh sách yêu thích</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <div className="flex justify-between items-center w-full pt-12">
          <div className="flex flex-col">
            <p className="text-2xl font-medium">Sản phẩm yêu thích</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((product, index) => (
              <ProductCard key={index} product={product} onFavoriteRemoved={handleProductRemoved} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Chưa có sản phẩm yêu thích nào</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FavoriteProducts;
