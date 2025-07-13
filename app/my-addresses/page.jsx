"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

const MyAddresses = () => {
  const { getToken, user } = useAppContext();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/get-addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setAddresses(data.addresses.reverse());
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-lg font-medium">Địa chỉ giao hàng</h2>
            <Link 
              href="/add-address"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Thêm địa chỉ
            </Link>
          </div>
          
          {loading ? (
            <Loading />
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center"
                >
                  <div className="col-span-1">
                    <Image
                      className="w-8 h-8"
                      src={assets.my_location_image}
                      alt="location_icon"
                    />
                  </div>

                  <div className="col-span-8 text-sm">
                    <p className="font-medium">Họ tên: {address.fullName}</p>
                    <p className="text-gray-500">Địa chỉ: {address.area}, {address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-gray-500">Số điện thoại: {address.phoneNumber}</p>
                  </div>

                  <div className="col-span-3 flex justify-end gap-3">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(address._id)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(address._id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              
              {addresses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Không có địa chỉ giao hàng. Thêm địa chỉ để tiếp tục.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAddresses;
