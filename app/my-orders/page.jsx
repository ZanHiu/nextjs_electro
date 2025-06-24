"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { getOrderStatusColor, getPaymentStatusColor, genOrderCode } from "@/utils/helpers";
import { formatDate } from "@/utils/format";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { formatPrice } from "@/utils/format";

const MyOrders = () => {
  const { currency, getToken, user, addToCart, router } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productReviews, setProductReviews] = useState({});

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

  const fetchProductReviews = async (productId) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}`
      );
      if (data.success) {
        setProductReviews(prev => ({
          ...prev,
          [productId]: data.reviews
        }));
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReorder = async (order) => {
    try {
      for (const item of order.items) {
        await addToCart(item.product._id, item.quantity);
      }
      router.push('/cart');
    } catch (error) {
      toast.error("Failed to add items to cart");
    }
  };

  const handleReviewClick = (productId, orderId) => {
    router.push(`/product/${productId}?orderId=${orderId}#review`);
  };

  const hasUserReviewed = (productId, orderId) => {
    const reviews = productReviews[productId] || [];
    return reviews.some(review => review.orderId === orderId);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto w-full space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Đơn hàng của tôi</h2>
                <p className="text-gray-500 mt-1">Theo dõi và quản lý đơn hàng của bạn</p>
              </div>
              <button onClick={()=> router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-orange-600">
                <Image
                  className="group-hover:-translate-x-1 transition"
                  src={assets.arrow_right_icon_colored}
                  alt="arrow_right_icon_colored"
                />
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              {/* <Image
                src={assets.empty_order}
                alt="No orders"
                className="w-32 h-32 mx-auto mb-4"
              /> */}
              <h3 className="text-xl font-medium text-gray-800 mb-2">Bạn chưa có đơn hàng nào</h3>
              <p className="text-gray-500 mb-6">Hãy bắt đầu mua sắm để xem đơn hàng của bạn ở đây</p>
              <button
                onClick={() => router.push('/all-products')}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Mã đơn hàng: {genOrderCode(order._id)}</span>
                        <span className="text-sm text-gray-500">
                          Ngày đặt: {formatDate(order.date)}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Products */}
                      <div className="col-span-12 lg:col-span-6">
                        <h4 className="font-medium text-gray-800 mb-3">Sản phẩm</h4>
                        <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={item.product.image[0]}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                  width={80}
                                  height={80}
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800 line-clamp-1">{item.product.name}</h5>
                                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                <p className="text-sm font-medium text-orange-500">
                                  {formatPrice(item.product.offerPrice)}{currency}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="col-span-12 lg:col-span-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-800 mb-3">Thông tin giao hàng</h4>
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">{order.address.fullName}</p>
                              <p className="text-gray-600">{order.address.area}</p>
                              <p className="text-gray-600">{`${order.address.city}, ${order.address.state}`}</p>
                              <p className="text-gray-600">{order.address.phoneNumber}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-3">Thông tin thanh toán</h4>
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">
                                Tổng tiền: {order.coupon && order.coupon.discountAmount ? (
                                  <>
                                    <span className="line-through text-gray-400 mr-2">{formatPrice(order.amount + order.coupon.discountAmount)}{currency}</span>
                                    <span>{formatPrice(order.amount)}{currency}</span>
                                    <br />
                                    <span className="text-green-600">Giảm giá: -{formatPrice(order.coupon.discountAmount)}{currency}</span>
                                  </>
                                ) : (
                                  <span>{formatPrice(order.amount)}{currency}</span>
                                )}
                              </p>
                              <p className="text-gray-600">
                                Phương thức: {order.paymentMethod}
                              </p>
                              <p className={`${getPaymentStatusColor(order.paymentStatus)} font-bold`}>
                                Trạng thái: {order.paymentStatus}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          Hủy đơn hàng
                        </button>
                      )}

                      {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          Mua lại
                        </button>
                      )}

                      {order.status === "DELIVERED" && (
                        <>
                          {order.items.map((item) => {
                            const productId = item.product._id;
                            if (!productReviews[productId]) {
                              fetchProductReviews(productId);
                            }
                            return (
                              <div key={productId}>
                                {hasUserReviewed(productId, order._id) ? (
                                  <button
                                    onClick={() => handleReviewClick(productId, order._id)}
                                    className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                                  >
                                    Xem đánh giá
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleReviewClick(productId, order._id)}
                                    className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition"
                                  >
                                    Đánh giá ngay
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
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
