"use client";
import React, { useState } from "react";
import ProductCard from "../product/ProductCard";
import { useAppContext } from "@/context/AppContext";

const NewProducts = ({ initialData = null }) => {
  const { newProducts: contextNewProducts, favoriteProductIds, refreshFavoriteProducts } = useAppContext();
  const [showAll, setShowAll] = useState(false);
  
  // Use initial data if provided (SSR), otherwise use context data (CSR fallback)
  const newProducts = initialData || contextNewProducts;
  const productsToShow = showAll ? newProducts.slice(0, 8) : newProducts.slice(0, 4);

  const handleToggleShow = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    
    setTimeout(() => {
      if (newShowAll) {
        const buttonElement = document.querySelector('#new-toggle-button');
        if (buttonElement) {
          buttonElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      } else {
        const titleElement = document.querySelector('#new-products-title');
        if (titleElement) {
          titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  };

  return (
    <>
      <div className="mt-12 new-products-section">
        <div className="flex flex-col items-start mb-8" id="new-products-title">
          <p className="text-3xl font-medium">Sản phẩm mới</p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-14 w-full">
            {productsToShow.map((product, index) => (
              <ProductCard 
                key={index} 
                product={product} 
                favoriteProductIds={favoriteProductIds}
                onFavoriteRemoved={refreshFavoriteProducts}
              />
            ))}
          </div>
          <button
            id="new-toggle-button"
            onClick={handleToggleShow}
            className="px-8 py-2 mb-16 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
          >
            {showAll ? "Ẩn bớt" : "Xem thêm"}
          </button>
        </div>
      </div>
    </>
  );
};

export default NewProducts;
