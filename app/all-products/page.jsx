"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AllProducts = () => {
  const { products, categories, brands } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenBrand, setIsOpenBrand] = useState(false);

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

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>
        <div className="flex gap-8 w-full mt-12">
          {/* Filter Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0 space-y-4">
            {/* Categories Dropdown */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => setIsOpenCategory(!isOpenCategory)}
                className="w-full p-4 flex items-center justify-between font-semibold text-lg hover:bg-gray-50"
              >
                <span>Categories</span>
                <ArrowDropDownIcon 
                  sx={{ fontSize: 24 }} 
                  className={`transition-transform ${isOpenCategory ? 'rotate-180' : ''}`}
                />
              </button>
              
              {isOpenCategory && (
                <div className="p-4 space-y-2 border-t">
                  <div className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded">
                    <input
                      type="radio"
                      id="all-categories"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="mr-2"
                    />
                    <label htmlFor="all-categories">All Categories</label>
                  </div>
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded">
                      <input
                        type="radio"
                        id={`category-${category._id}`}
                        name="category"
                        checked={selectedCategory === category._id}
                        onChange={() => setSelectedCategory(category._id)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category._id}`}>{category.name}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Brands Dropdown */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                onClick={() => setIsOpenBrand(!isOpenBrand)}
                className="w-full p-4 flex items-center justify-between font-semibold text-lg hover:bg-gray-50"
              >
                <span>Brands</span>
                <ArrowDropDownIcon
                  sx={{ fontSize: 24 }}
                  className={`transition-transform ${isOpenBrand ? 'rotate-180' : ''}`}
                />
              </button>
              
              {isOpenBrand && (
                <div className="p-4 space-y-2 border-t">
                  <div className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded">
                    <input
                      type="radio"
                      id="all-brands"
                      name="brand"
                      checked={selectedBrand === 'all'}
                      onChange={() => setSelectedBrand('all')}
                      className="mr-2"
                    />
                    <label htmlFor="all-brands">All Brands</label>
                  </div>
                  {brands.map((brand) => (
                    <div key={brand._id} className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded">
                      <input
                        type="radio"
                        id={`brand-${brand._id}`}
                        name="brand"
                        checked={selectedBrand === brand._id}
                        onChange={() => setSelectedBrand(brand._id)}
                        className="mr-2"
                      />
                      <label htmlFor={`brand-${brand._id}`}>{brand.name}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12 pb-14 w-full">
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
