'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";

const BrandList = () => {

  const { router, getToken, user } = useAppContext()

  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerBrand = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brands/seller-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (data.success) {
        setBrands(data.brands);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchSellerBrand();
    }
  }, [user, getToken]);

  // const handleDelete = async (id) => {
  //   if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) {
  //     try {
  //       const token = await getToken();
  //       const { data } = await axios.delete(
  //         `${process.env.NEXT_PUBLIC_API_URL}/brands/delete/${id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (data.success) {
  //         toast.success(data.message);
  //         // Refresh brand list after deletion
  //         fetchSellerBrand();
  //       } else {
  //         toast.error(data.message);
  //       }
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   }
  // };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/brands/update/${id}`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchSellerBrand();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h1 className="text-2xl font-semibold mb-6">Quản lý thương hiệu</h1>
        <div className="flex flex-col items-center w-full rounded-md bg-white border border-gray-500/20">
          <div className="overflow-x-auto w-full">
            <table className="table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/5 md:w-1/4 px-4 py-3 font-medium truncate">Thương hiệu</th>
                <th className="w-1/6 px-4 py-3 font-medium truncate max-sm:hidden">Id</th>
                <th className="w-1/4 px-4 py-3 font-medium truncate max-sm:hidden">Hoạt động</th>
                <th className="w-1/4 px-4 py-3 font-medium truncate">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {brands.map((brand, index) => (
                <tr key={index} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate" data-tooltip-id="brand-tooltip" data-tooltip-content={brand.name}>
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={brand.image[0]}
                        alt="product Image"
                        className="w-20 h-4 object-contain"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">{brand.name}</span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden truncate" data-tooltip-id="brand-tooltip" data-tooltip-content={brand.brandId}>{brand.brandId}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${brand.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {brand.isActive ? "Đang hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-nowrap">
                      <button onClick={() => router.push(`/brands/${brand._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md">
                        <span className="hidden md:block">Xem</span>
                      </button>
                      <button onClick={() => router.push(`/seller/edit-brand/${brand._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-green-600 text-white rounded-md">
                        <span className="hidden md:block">Sửa</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(brand._id, brand.isActive)}
                        className={`flex items-center gap-1 px-1.5 md:px-3.5 py-2 ${brand.isActive ? "bg-red-600" : "bg-blue-600"} text-white rounded-md hover:bg-opacity-80`}
                      >
                        {brand.isActive ? "Khóa" : "Kích hoạt"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Tooltip id="brand-tooltip" place="top" effect="solid" multiline={true} />
          </div>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default BrandList;
