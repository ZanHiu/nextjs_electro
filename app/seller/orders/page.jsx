"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { OrderStatus, PaymentStatus } from '@/utils/constants';
import { getOrderStatusColor, getPaymentStatusColor } from '@/utils/helpers';
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/common/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { formatPrice, formatDate } from "@/utils/format";
import Tabs from "@/components/common/Tabs";

const Orders = () => {

  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Định nghĩa thứ tự trạng thái đơn hàng
  const orderStatusFlow = ['PENDING', 'PROCESSING', 'DELIVERED'];
  
  // Hàm kiểm tra xem có thể chuyển sang trạng thái mới không
  const canUpdateToStatus = (currentStatus, targetStatus) => {
    const currentIndex = orderStatusFlow.indexOf(currentStatus);
    const targetIndex = orderStatusFlow.indexOf(targetStatus);
    
    // Chỉ cho phép chuyển tiến 1 bước hoặc giữ nguyên
    return targetIndex === currentIndex || targetIndex === currentIndex + 1;
  };

  // Hàm lấy trạng thái tiếp theo có thể chuyển đến
  const getNextAvailableStatus = (currentStatus) => {
    const currentIndex = orderStatusFlow.indexOf(currentStatus);
    if (currentIndex < orderStatusFlow.length - 1) {
      return orderStatusFlow[currentIndex + 1];
    }
    return null;
  };

  const fetchOrdersByTab = async (tab) => {
    try {
      setLoading(true);
      const token = await getToken();
      let url = '';
      switch (tab) {
        case 'pending':
          url = `${process.env.NEXT_PUBLIC_API_URL}/orders/pending`;
          break;
        case 'processing':
          url = `${process.env.NEXT_PUBLIC_API_URL}/orders/processing`;
          break;
        case 'delivered':
          url = `${process.env.NEXT_PUBLIC_API_URL}/orders/delivered`;
          break;
        case 'cancelled':
          url = `${process.env.NEXT_PUBLIC_API_URL}/orders/cancelled`;
          break;
        default:
          url = `${process.env.NEXT_PUBLIC_API_URL}/orders/seller-orders`;
      }
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders((data.orders || []).reverse());
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/update-status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Order status updated successfully");
        fetchOrdersByTab(activeTab);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrdersByTab(activeTab);
    }
  }, [user, activeTab, getToken]);

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll text-sm">
      <div className="w-full md:px-10 px-4 pt-4 md:pt-10">
        <h1 className="text-2xl font-semibold mb-6">Quản lý đơn hàng</h1>
        <Tabs
          tabs={[
            { key: 'all', label: 'Tất cả' },
            { key: 'pending', label: 'Chưa xử lý' },
            { key: 'processing', label: 'Đang xử lý' },
            { key: 'delivered', label: 'Đã giao' },
            { key: 'cancelled', label: 'Đã hủy' },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
          <div className="w-full rounded-md bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-700 border-b">
              <div className="col-span-4">Chi tiết sản phẩm</div>
              <div className="col-span-4">Thông tin khách hàng</div>
              <div className="col-span-2">Thông tin thanh toán</div>
              <div className="col-span-2">Trạng thái đơn hàng</div>
            </div>
            {orders.map((order, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-4 flex gap-3">
                  <Image
                    className="w-16 h-16 object-cover"
                    src={assets.box_image}
                    alt="box_image"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium line-clamp-2">
                      {order.items
                        .map(
                          (item) => item.product.name + ` x ${item.quantity}`
                        )
                        .join(", ")}
                    </span>
                    <span className="text-gray-500">Sản phẩm: {order.items.length}</span>
                  </div>
                </div>

                <div className="col-span-4 text-sm">
                  <p className="font-medium">{order.address.fullName}</p>
                  <p className="text-gray-500">{order.address.area}</p>
                  <p className="text-gray-500">{`${order.address.city}, ${order.address.state}`}</p>
                  <p className="text-gray-500">{order.address.phoneNumber}</p>
                </div>

                <div className="col-span-2 text-sm">
                  <p className="font-medium">{formatPrice(order.amount)}{currency}</p>
                  <p className={`font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                    Thanh toán: {order.paymentStatus}
                  </p>
                  <p className="text-gray-500">Phương thức: {order.paymentMethod}</p>
                </div>

                <div className="col-span-2 text-sm">
                  {order.status === "CANCELLED" ? (
                    // Hiển thị trạng thái đã hủy (không cho chọn)
                    <div className="w-full border p-2 rounded mb-2 bg-gray-100">
                      <span className="text-red-600 font-medium">{OrderStatus.CANCELLED}</span>
                    </div>
                  ) : (
                    // Dropdown cho các trạng thái khác
                    <select 
                      className={`w-full border p-2 rounded mb-2 bg-white ${getOrderStatusColor(order.status)}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option 
                        value="PENDING" 
                        disabled={!canUpdateToStatus(order.status, "PENDING")}
                      >
                        {OrderStatus.PENDING}
                      </option>
                      <option 
                        value="PROCESSING" 
                        disabled={!canUpdateToStatus(order.status, "PROCESSING")}
                      >
                        {OrderStatus.PROCESSING}
                      </option>
                      <option 
                        value="DELIVERED" 
                        disabled={!canUpdateToStatus(order.status, "DELIVERED")}
                      >
                        {OrderStatus.DELIVERED}
                      </option>
                    </select>
                  )}
                  
                  {/* Hiển thị trạng thái tiếp theo có thể chuyển đến */}
                  {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                    <p className="text-xs text-blue-600 font-medium">
                      Tiếp theo: {getNextAvailableStatus(order.status) ? OrderStatus[getNextAvailableStatus(order.status)] : "Hoàn thành"}
                    </p>
                  )}
                  
                  <p className="text-gray-500">
                    Ngày: {formatDate(order.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
