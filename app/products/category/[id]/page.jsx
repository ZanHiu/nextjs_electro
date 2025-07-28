"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import toast from "react-hot-toast";
import axios from "axios";

const CategoryProducts = () => {
  const { id } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);

  const fetchProductsByCategory = async (categoryId) => {
    if (!categoryId) return;
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/category/${categoryId}`);
      if (data.success) {
        setCategoryProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14">
          {categoryProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryProducts;
