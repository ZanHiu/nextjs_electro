import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const SaleProducts = () => {
  const { saleProducts, router } = useAppContext();

  return (
    <>
      <div className="mt-12">
        <div className="flex flex-col items-start mb-8">
          <p className="text-3xl font-medium">On Sale</p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-14 w-full">
            {saleProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          {/* <button 
            onClick={() => { router.push('/all-products') }} 
            className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-300"
          >
            See more
          </button> */}
        </div>
      </div>
    </>
  );
};

export default SaleProducts;
