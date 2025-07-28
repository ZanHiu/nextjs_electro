"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Filter from "@/components/product/Filter";
import { useRouter } from "next/navigation";
import ProductToolbar from "@/components/product/ProductToolbar";
import { SortOptions } from "@/utils/constants";

const getInitialFilter = (key, defaultValue = 'all') => {
  if (typeof window === "undefined") return defaultValue;
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || defaultValue;
};

const AllProducts = () => {
  const { products, categories, brands, favoriteProductIds, refreshFavoriteProducts } = useAppContext();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(() => getInitialFilter('category', 'all'));
  const [selectedBrand, setSelectedBrand] = useState(() => getInitialFilter('brand', 'all'));
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortType, setSortType] = useState("default");
  const [sortedProducts, setSortedProducts] = useState(filteredProducts);

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

  // Khi URL thay đổi (user nhập tay hoặc reload/back/forward), đồng bộ lại state filter
  useEffect(() => {
    const syncFilterFromUrl = () => {
      setSelectedCategory(getInitialFilter('category', 'all'));
      setSelectedBrand(getInitialFilter('brand', 'all'));
    };
    window.addEventListener('popstate', syncFilterFromUrl);
    return () => window.removeEventListener('popstate', syncFilterFromUrl);
  }, []);

  const toNumber = (val) => Number(String(val).replace(/\./g, ''));

  // Sắp xếp sản phẩm khi filteredProducts hoặc sortType thay đổi
  useEffect(() => {
    let sorted = [...filteredProducts];
    if (sortType === "price-asc") {
      sorted.sort((a, b) => toNumber(a.offerPrice) - toNumber(b.offerPrice));
    } else if (sortType === "price-desc") {
      sorted.sort((a, b) => toNumber(b.offerPrice) - toNumber(a.offerPrice));
    }
    setSortedProducts(sorted);
  }, [filteredProducts, sortType]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col pt-12">
          <p className="text-2xl font-medium">Tất cả sản phẩm</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>
        <div className="flex gap-8 w-full mt-4">
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
          <div className="w-full flex flex-col gap-4">
            {/* Count & Sort */}
            <ProductToolbar
              total={sortedProducts.length}
              sortType={sortType}
              setSortType={setSortType}
              sortOptions={SortOptions}
            />
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-14 w-full">
              {sortedProducts.map((product, index) => (
                <ProductCard 
                  key={index} 
                  product={product} 
                  favoriteProductIds={favoriteProductIds}
                  onFavoriteRemoved={refreshFavoriteProducts}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
