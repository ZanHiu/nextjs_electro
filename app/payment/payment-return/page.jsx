"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import { assets } from "@/assets/assets";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

const PaymentReturn = () => {
  const { router, setCartItems } = useAppContext();
  const [status, setStatus] = useState("processing");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Lấy params từ URL trực tiếp
        const params = new URLSearchParams(window.location.search);
        const vnp_ResponseCode = params.get("vnp_ResponseCode");
        const vnp_OrderInfo = params.get("vnp_OrderInfo");
        const vnp_TransactionNo = params.get("vnp_TransactionNo");
        const vnp_PayDate = params.get("vnp_PayDate");
        const vnp_BankCode = params.get("vnp_BankCode");
        const vnp_Amount = params.get("vnp_Amount");

        // Nếu không có thông tin VNPay, có thể là thanh toán COD
        if (!vnp_OrderInfo && !vnp_ResponseCode) {
          setStatus("success");
          setShowSuccess(true);
          setTimeout(() => {
            router.push("/my-orders");
          }, 5000);
          return;
        }

        // Extract orderId from vnp_OrderInfo
        const orderId = vnp_OrderInfo
          .replace("Thanh toan cho ma GD:", "")
          .trim();

        if (vnp_ResponseCode === "00" && orderId) {
          console.log("Payment successful, updating order:", orderId);

          // Update order status
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/verify-payment`,
            {
              orderId,
              transactionNo: vnp_TransactionNo,
              payDate: vnp_PayDate,
              bankCode: vnp_BankCode,
              amount: vnp_Amount,
              responseCode: vnp_ResponseCode,
            }
          );

          console.log("Payment verification response:", data);

          if (data.success) {
            setStatus("success");
            setCartItems({});
            toast.success("Thanh toán thành công!");
            setShowSuccess(true);
            setTimeout(() => {
              router.push("/my-orders");
            }, 5000);
          } else {
            throw new Error(data.message || "Xác thực thanh toán thất bại");
          }
        } else {
          throw new Error("Thanh toán thất bại hoặc phản hồi không hợp lệ");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        toast.error(error.message || "Thanh toán thất bại");
        setTimeout(() => {
          router.push("/cart");
        }, 2000);
      }
    };

    verifyPayment();
  }, []); // Chỉ chạy một lần khi component mount

  if (showSuccess) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-5">
        <div className="flex justify-center items-center relative">
          <Image className="absolute p-5" src={assets.checkmark} alt="" />
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
        </div>
        <div className="text-center text-2xl font-semibold">
          Đơn hàng đã được thanh toán thành công!
        </div>
        <p className="text-gray-600">
          Đang chuyển hướng đến trang đơn hàng của bạn...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {status === "processing" && (
        <>
          <Loading />
          <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="text-red-500 text-2xl">Thanh toán thất bại!</div>
          <p className="mt-2 text-gray-600">Đang chuyển hướng về giỏ hàng...</p>
        </>
      )}
    </div>
  );
};

export default PaymentReturn;
