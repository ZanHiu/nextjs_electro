"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Filter from "@/components/Filter";
import { useRouter, useSearchParams } from "next/navigation";

const AllProducts = () => {
  const { products, categories, brands } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc filter từ URL khi mount
  const getInitialFilter = (key, defaultValue = 'all') => {
    const value = searchParams.get(key);
    return value || defaultValue;
  };

  const [selectedCategory, setSelectedCategory] = useState(() => getInitialFilter('category', 'all'));
  const [selectedBrand, setSelectedBrand] = useState(() => getInitialFilter('brand', 'all'));
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Cập nhật URL khi filter thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedBrand && selectedBrand !== 'all') params.set('brand', selectedBrand);
    const query = params.toString();
    router.replace(`/all-products${query ? `?${query}` : ''}`);
  }, [selectedCategory, selectedBrand]);

  // Fetch sản phẩm khi filter thay đổi
  const fetchFilteredProducts = async () => {
    try {
      if (selectedCategory === 'all' && selectedBrand === 'all') {
        setFilteredProducts(products);
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/filter`, {
          params: {
            categoryId: selectedCategory,
            brandId: selectedBrand
          }
        }
      );
      if (response?.data.success) {
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setFilteredProducts(products);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, products]);

  // Khi URL thay đổi (user nhập tay hoặc reload), đồng bộ lại state filter
  useEffect(() => {
    setSelectedCategory(getInitialFilter('category', 'all'));
    setSelectedBrand(getInitialFilter('brand', 'all'));
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col pt-12">
          <p className="text-2xl font-medium">Tất cả sản phẩm</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>
        <div className="flex gap-8 w-full mt-12">
          {/* Filter Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0 space-y-4">
            <Filter
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              onReset={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
              }}
            />
          </div>
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-14 w-full">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
