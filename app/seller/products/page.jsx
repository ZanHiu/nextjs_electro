'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { formatPrice } from "@/utils/format";

const ProductList = () => {

  const { router, getToken, user, currency } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/seller-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (data.success) {
        setProducts(data.products)
        setLoading(false)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user])

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        const token = await getToken();
        const { data } = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/products/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          toast.success(data.message);
          // Refresh product list after deletion
          fetchSellerProduct();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h1 className="text-2xl font-semibold mb-6">Quản lý sản phẩm</h1>
        <div className="flex flex-col items-center w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Sản phẩm</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Danh mục</th>
                <th className="px-4 py-3 font-medium truncate">
                  Giá
                </th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={product.image[0]}
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{product.category.name}</td>
                  <td className="px-4 py-3">{formatPrice(product.offerPrice)}{currency}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/product/${product._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md">
                        <span className="hidden md:block">Xem</span>
                      </button>
                      <button onClick={() => router.push(`/seller/edit-product/${product._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-green-600 text-white rounded-md">
                        <span className="hidden md:block">Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <span className="hidden md:block">Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ProductList;
