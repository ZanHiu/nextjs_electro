"use client";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";

const EditCoupon = () => {
  const { id } = useParams();
  const { getToken, router } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "PERCENTAGE",
    value: "",
    startDate: "",
    endDate: "",
    maxUses: "",
    minOrderAmount: "0",
    prefix: "COUPON",
    isInfinite: false,
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/coupons/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          const coupon = data.coupon;
          setFormData({
            type: coupon.type,
            value: coupon.value.toString(),
            startDate: coupon.startDate ? coupon.startDate.split('T')[0] : "",
            endDate: coupon.endDate ? coupon.endDate.split('T')[0] : "",
            maxUses: coupon.maxUses.toString(),
            minOrderAmount: coupon.minOrderAmount.toString(),
            prefix: coupon.code.replace(/\d+$/, ''),
            isInfinite: !coupon.endDate,
          });
        }
      } catch (error) {
        toast.error(error.message);
        router.push("/seller/coupons");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoupon();
    }
  }, [id, getToken, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const updateData = {
        ...formData,
        endDate: formData.isInfinite ? null : formData.endDate,
      };

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/edit/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        router.push("/seller/coupons");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="flex-1 h-screen flex flex-col overflow-scroll justify-between text-sm">
      {loading ? <Loading /> : (
          <form onSubmit={handleSubmit} className="w-full md:p-10 p-4 space-y-5 max-w-lg">
            <h1 className="text-2xl font-semibold mb-6">Sửa mã giảm giá</h1>
              <div className="flex flex-col gap-1 max-w-md">
                <label className="text-base font-medium">
                  Tiền tố mã giảm giá
                </label>
                <input
                  type="text"
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleChange}
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                  placeholder="Ví dụ: COUPON, WELCOME, SUMMER, etc."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Coupon code will be generated automatically with format: {formData.prefix}XXXX
                </p>
              </div>

              <div className="flex flex-col gap-1 max-w-md">
                <label className="text-base font-medium">
                  Loại mã giảm giá
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                >
                  <option value="PERCENTAGE">Phần trăm</option>
                  <option value="FIXED_AMOUNT">Số tiền cố định</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 max-w-md">
                <label className="text-base font-medium">
                  Giá trị giảm giá
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                  placeholder={formData.type === "PERCENTAGE" ? "Ví dụ: 10" : "Ví dụ: 100000"}
                  min="0"
                  max={formData.type === "PERCENTAGE" ? "100" : undefined}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.type === "PERCENTAGE"
                    ? "Nhập phần trăm giảm giá (0-100)"
                    : "Nhập số tiền giảm giá (VND)"}
                </p>
              </div>

              <div className="flex flex-col gap-1 max-w-md">
                <label className="text-base font-medium">
                  Thời gian hiệu lực
                </label>
                <div className="mb-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isInfinite"
                      checked={formData.isInfinite}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Hiệu lực vô hạn</span>
                  </label>
                </div>

                {!formData.isInfinite && (
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required={!formData.isInfinite}
                      />
                      <p className="text-sm text-gray-500 mt-1">Ngày bắt đầu</p>
                    </div>
                    <div>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required={!formData.isInfinite}
                      />
                      <p className="text-sm text-gray-500 mt-1">Ngày kết thúc</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 max-w-md">
                <label className="text-base font-medium">
                  Số lượng sử dụng tối đa
                </label>
                <input
                  type="number"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleChange}
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                  placeholder="Ví dụ: 10"
                  min="1"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 max-w-md">
                <label className="text-base font-medium">
                  Giá trị đơn hàng tối thiểu (VND)
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                  placeholder="Ví dụ: 1000000"
                  min="0"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 disabled:bg-gray-400"
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
          </form>
      )}
      <Footer />
    </div>
  );
};

export default EditCoupon;
