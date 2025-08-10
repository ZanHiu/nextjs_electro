"use client";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PaymentMethod from "./PaymentMethod";
import { formatPrice } from "@/utils/format";

const OrderSummary = () => {
  const { 
    currency, 
    router, 
    getCartCount, 
    getCartAmount, 
    getToken, 
    user, 
    cartItems, 
    setCartItems, 
  } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [userVouchers, setUserVouchers] = useState([]);
  const [voucherDropdownOpen, setVoucherDropdownOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/get-addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const fetchUserVouchers = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-coupons/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        const now = new Date();
        const validVouchers = data.userCoupons.filter(v => v.status !== 'USED' && v.status !== 'EXPIRED' && new Date(v.couponId?.endDate) >= now);
        setUserVouchers(validVouchers);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handleVoucherSelect = async (voucher) => {
    setSelectedVoucher(voucher);
    setVoucherDropdownOpen(false);
    if (!voucher) {
      setAppliedCoupon(null);
      setCouponCode('');
      return;
    }
    try {
      setIsValidatingCoupon(true);
      const token = await getToken();
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`,
        {
          code: voucher.couponId.code,
          orderAmount: getCartAmount()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCode(data.coupon.code);
        toast.success('Coupon applied!');
      } else {
        setAppliedCoupon(null);
        setCouponCode('');
        toast.error(data.message);
      }
    } catch (error) {
      setAppliedCoupon(null);
      setCouponCode('');
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      return toast.error('Please enter a coupon code');
    }

    try {
      setIsValidatingCoupon(true);
      const token = await getToken();
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`,
        {
          code: couponCode,
          orderAmount: getCartAmount()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (data.success) {
        setAppliedCoupon(data.coupon);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Vui lòng chọn điểm giao hàng");
      }
  
      // Parse cartItems: key = "productId|variantId" hoặc "productId|"
      let cartItemsArray = Object.keys(cartItems).map((key) => {
        const [productId, variantId] = key.split('|');
        return {
          product: productId,
          variant: variantId || undefined,
        quantity: cartItems[key],
        };
      });
      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);
      
      if (cartItemsArray.length === 0) {
        return toast.error("Giỏ hàng trống");
      }
  
      const token = await getToken();
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/create`,
        {
          address: selectedAddress._id,
          items: cartItemsArray,
          paymentMethod,
          couponCode: appliedCoupon?.code
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (data.success) {
        if (paymentMethod === 'VNPAY') {
          const paymentResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/create-vnpay-payment`,
            {
              orderId: data.order._id,
              amount: data.order.amount
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
  
          if (paymentResponse.data.success) {
            window.location.href = paymentResponse.data.paymentUrl;
          }
        } else {
          setCartItems({});
          router.push('/order-placed');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
      fetchUserVouchers();
    }
  }, [user])

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'PERCENTAGE') {
      return Math.floor((getCartAmount() * appliedCoupon.value) / 100);
    }
    return appliedCoupon.value;
  };

  const calculateTotal = () => {
    const subtotal = getCartAmount();
    const discount = calculateDiscount();
    return subtotal - discount;
  };

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Tóm tắt đơn hàng
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div>
        <label className="text-base font-medium uppercase text-gray-600 block mb-2">
          Phương thức thanh toán
        </label>
        <PaymentMethod 
          selectedMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
        />
      </div>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Chọn địa chỉ
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Chọn địa chỉ"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Thêm địa chỉ
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Voucher select UI */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Chọn mã giảm giá
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setVoucherDropdownOpen(!voucherDropdownOpen)}
              disabled={userVouchers.length === 0}
            >
              <span>
                {selectedVoucher
                  ? `${selectedVoucher.couponId?.code} - ${selectedVoucher.couponId?.type === 'PERCENTAGE' ? `Giảm ${selectedVoucher.couponId?.value}%` : `Giảm ${selectedVoucher.couponId?.value?.toLocaleString()}${currency}`}`
                  : userVouchers.length === 0
                  ? "Không có mã giảm giá"
                  : "Chọn mã giảm giá"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${voucherDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {voucherDropdownOpen && userVouchers.length > 0 && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 max-h-60 overflow-y-auto">
                {userVouchers.map((voucher, idx) => (
                  <li
                    key={voucher._id}
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex flex-col"
                    onClick={() => handleVoucherSelect(voucher)}
                  >
                    <span className="font-medium text-orange-600">{voucher.couponId?.code}</span>
                    <span className="text-xs text-gray-500">
                      {voucher.couponId?.type === 'PERCENTAGE'
                        ? `Discount ${voucher.couponId?.value}%`
                        : `Discount ${voucher.couponId?.value?.toLocaleString()}${currency}`}
                      {voucher.couponId?.minOrderAmount > 0 && ` | Minimum Order: ${voucher.couponId?.minOrderAmount?.toLocaleString()}${currency}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      Hiệu lực: {new Date(voucher.couponId?.startDate).toLocaleDateString()} - {new Date(voucher.couponId?.endDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
                <li
                  onClick={() => handleVoucherSelect(null)}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center text-red-500"
                >
                  x Loại bỏ
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Manual coupon input */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Hoặc nhập mã giảm giá
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="flex-1 outline-none p-2.5 text-gray-600 border"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={!!selectedVoucher || !!appliedCoupon}
            />
            <button 
              className="bg-orange-600 text-white px-6 py-2.5 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              onClick={validateCoupon}
              disabled={isValidatingCoupon || !!appliedCoupon || !!selectedVoucher}
            >
              Áp dụng
            </button>
          </div>
          {appliedCoupon && (
            <div className="mt-2 text-sm text-green-600">
              Mã giảm giá #{appliedCoupon.code} đã được áp dụng
              <button 
                className="ml-2 text-red-600 hover:text-red-700"
                onClick={() => {
                  setAppliedCoupon(null);
                  setCouponCode('');
                  setSelectedVoucher(null);
                }}
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">{getCartCount()} mặt hàng</p>
            <p className="text-gray-800">{formatPrice(getCartAmount())}{currency}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Phí vận chuyển</p>
            <p className="font-medium text-gray-800">0{currency}</p>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <p>Giảm ({appliedCoupon.type === 'PERCENTAGE' ? `${appliedCoupon.value}%` : 'Fixed'})</p>
              <p className="font-medium">-{formatPrice(calculateDiscount())}{currency}</p>
            </div>
          )}
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Tổng tiền</p>
            <p>{formatPrice(calculateTotal())}{currency}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        {paymentMethod === 'VNPAY' ? 'Thanh toán' : 'Đặt hàng'}
      </button>
    </div>
  );
};

export default OrderSummary;
