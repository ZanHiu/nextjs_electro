"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import VoucherTicket from "@/components/VoucherTicket";

const MyVouchers = () => {
  const { getToken, currency, user } = useAppContext();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-coupons/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setVouchers(data.userCoupons);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchVouchers(); }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              Voucher của tôi
            </h2>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="max-w-5xl">
              {vouchers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Bạn chưa nhận voucher nào.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vouchers.map((item) => (
                    <VoucherTicket key={item._id} item={item} currency={currency} small />
                  ))}
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

export default MyVouchers;
