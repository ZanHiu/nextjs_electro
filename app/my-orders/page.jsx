"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { getOrderStatusColor, getPaymentStatusColor } from '@/utils/helpers';
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setOrders(data.orders.reverse());
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
      fetchOrders();
      // Fetch more frequently initially
      const quickInterval = setInterval(() => {
        fetchOrders();
      }, 2000); // Every 2 seconds
  
      // After 30 seconds, switch to less frequent updates
      setTimeout(() => {
        clearInterval(quickInterval);
        const normalInterval = setInterval(() => {
          fetchOrders();
        }, 10000); // Every 10 seconds
  
        return () => clearInterval(normalInterval);
      }, 30000);
  
      return () => clearInterval(quickInterval);
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>
          {loading ? (
            <Loading />
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center"
                >
                  <div className="col-span-4 flex gap-3">
                    <Image
                      className="w-16 h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium line-clamp-2">
                        {order.items
                          .map(
                            (item) => item.product.name + ` x ${item.quantity}`
                          )
                          .join(", ")}
                      </span>
                      <span className="text-gray-500">
                        Items: {order.items.length}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-3 text-sm">
                    <p className="font-medium">{order.address.fullName}</p>
                    <p className="text-gray-500">{order.address.area}</p>
                    <p className="text-gray-500">{`${order.address.city}, ${order.address.state}`}</p>
                    <p className="text-gray-500">{order.address.phoneNumber}</p>
                  </div>

                  <div className="col-span-3 text-sm">
                    <p className="font-medium">
                      {currency}
                      {order.amount}
                    </p>
                    <p className={getPaymentStatusColor(order.paymentStatus)}>
                      Payment: {order.paymentStatus}
                    </p>
                    <p className="text-gray-500">
                      Method: {order.paymentMethod}
                    </p>
                    <p className="text-gray-500">
                      Date: {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="col-span-2 text-sm text-right">
                    <p
                      className={`font-medium ${getOrderStatusColor(order.status)}`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
