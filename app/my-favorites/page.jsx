"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import toast from "react-hot-toast";

const MyFavorites = () => {
  const { user, getToken, favoriteProductIds, refreshFavoriteProducts } = useAppContext();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const token = await getToken();
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
      }
    } catch (error) {
      toast.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const handleFavoriteRemoved = () => {
    fetchFavorites();
  };

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

        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14">
            {favoriteProducts.map((product, index) => (
              <ProductCard 
                key={index} 
                product={product} 
                favoriteProductIds={favoriteProductIds}
                onFavoriteRemoved={refreshFavoriteProducts}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-medium mb-4">Chưa có sản phẩm yêu thích</h2>
            <p className="text-gray-500">Hãy thêm sản phẩm vào danh sách yêu thích của bạn</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyFavorites;
