import React from "react";
import ProductCard from "../product/ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { saleProducts, newProducts, router } = useAppContext();

  return (
    <>
      {/* New Products */}
      <div className="flex flex-col items-center pt-14">
        <p className="text-2xl font-medium text-left w-full">New Arrivals</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
          {newProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <button 
          onClick={() => { router.push('/all-products') }} 
          className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
        >
          See more
        </button>
      </div>
      {/* Sale Products */}
      <div className="flex flex-col items-center pt-14">
        <p className="text-2xl font-medium text-left w-full">On Sale</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
          {saleProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <button 
          onClick={() => { router.push('/all-products') }} 
          className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
        >
          See more
        </button>
      </div>
    </>
  );
};

export default HomeProducts;
