"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

// Helper function để lấy giá hiển thị từ product variants
const getDisplayPrice = (product) => {
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  return firstVariant ? firstVariant.price : (product.price || 0);
};

const getDisplayOfferPrice = (product) => {
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  return firstVariant ? firstVariant.offerPrice : (product.offerPrice || 0);
};

const CategoryProducts = () => {
  const { id } = useParams();
  const { favoriteProductIds, refreshFavoriteProducts } = useAppContext();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductsByCategory = async (categoryId) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/category/${categoryId}`);
      if (data.success) {
        setCategoryProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductsByCategory(id);
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <div className="flex justify-between items-center w-full pt-12">
          <div className="flex flex-col">
            <p className="text-2xl font-medium">Category Products</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}
        
        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14">
            {categoryProducts.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                favoriteProductIds={favoriteProductIds}
                onFavoriteRemoved={refreshFavoriteProducts}
              />
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!loading && categoryProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryProducts;