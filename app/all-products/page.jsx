"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/common/Pagination";
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

const getInitialPage = () => {
  if (typeof window === "undefined") return 1;
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('page')) || 1;
};

// Helper function để lấy giá hiển thị từ product variants
const getDisplayPrice = (product) => {
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  return firstVariant ? firstVariant.price : product.price;
};

const getDisplayOfferPrice = (product) => {
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  return firstVariant ? firstVariant.offerPrice : product.offerPrice;
};

const AllProducts = () => {
  const { categories, brands, favoriteProductIds, refreshFavoriteProducts } = useAppContext();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(() => getInitialFilter('category', 'all'));
  const [selectedBrand, setSelectedBrand] = useState(() => getInitialFilter('brand', 'all'));
  const [currentPage, setCurrentPage] = useState(() => getInitialPage());
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState("default");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 9
  });
  const [loading, setLoading] = useState(false);

  // Cập nhật URL khi filter hoặc page thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedBrand && selectedBrand !== 'all') params.set('brand', selectedBrand);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const query = params.toString();
    router.replace(`/all-products${query ? `?${query}` : ''}`, { scroll: false });
  }, [selectedCategory, selectedBrand, currentPage]);

  // Fetch sản phẩm khi filter hoặc page thay đổi
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/filter`, {
          params: {
            categoryId: selectedCategory,
            brandId: selectedBrand,
            page: currentPage,
            limit: 9
          }
        }
      );
      if (response?.data.success) {
        setFilteredProducts(response.data.products);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, currentPage]);

  // Khi URL thay đổi (user nhập tay hoặc reload/back/forward), đồng bộ lại state filter
  useEffect(() => {
    const syncFilterFromUrl = () => {
      setSelectedCategory(getInitialFilter('category', 'all'));
      setSelectedBrand(getInitialFilter('brand', 'all'));
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', syncFilterFromUrl);
    return () => window.removeEventListener('popstate', syncFilterFromUrl);
  }, []);

  const toNumber = (val) => Number(String(val).replace(/\./g, ''));

  // Sắp xếp sản phẩm khi filteredProducts hoặc sortType thay đổi
  useEffect(() => {
    let sorted = [...filteredProducts];
    if (sortType === "price-asc") {
      sorted.sort((a, b) => toNumber(getDisplayOfferPrice(a)) - toNumber(getDisplayOfferPrice(b)));
    } else if (sortType === "price-desc") {
      sorted.sort((a, b) => toNumber(getDisplayOfferPrice(b)) - toNumber(getDisplayOfferPrice(a)));
    }
    setSortedProducts(sorted);
  }, [filteredProducts, sortType]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterReset = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setCurrentPage(1);
  };

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
              setSelectedCategory={(category) => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              selectedBrand={selectedBrand}
              setSelectedBrand={(brand) => {
                setSelectedBrand(brand);
                setCurrentPage(1);
              }}
              onReset={handleFilterReset}
            />
          </div>
          <div className="w-full flex flex-col gap-4">
            {/* Count & Sort */}
            <ProductToolbar
              total={pagination.total}
              sortType={sortType}
              setSortType={setSortType}
              sortOptions={SortOptions}
            />
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            )}
            
            {/* Products Grid */}
            {!loading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-14 w-full">
                  {sortedProducts.map((product, index) => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      favoriteProductIds={favoriteProductIds}
                      onFavoriteRemoved={refreshFavoriteProducts}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                <Pagination
                  currentPage={pagination.current}
                  totalPages={pagination.pages}
                  total={pagination.total}
                  limit={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </>
            )}
            
            {/* Empty State */}
            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;