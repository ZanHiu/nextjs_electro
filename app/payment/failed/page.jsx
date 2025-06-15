"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PaymentFailed = () => {
  const router = useRouter();

  useEffect(() => {
    // Lấy message từ URL params trực tiếp
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");

    if (message) {
      toast.error(message || "Payment failed. Please try again.");
    } else {
      toast.error("Payment failed. Please try again.");
    }

    // Redirect sau 3 giây
    const timeout = setTimeout(() => {
      router.push("/cart");
    }, 3000);

    // Cleanup timeout khi component unmount
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-medium text-red-600">Payment Failed</h2>
        <p className="text-gray-600 mt-2">Redirecting to cart...</p>
      </div>
    </div>
  );
};

export default PaymentFailed;
