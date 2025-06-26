"use client";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const AddCoupon = () => {
  const router = useRouter();
  const { getToken } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "PERCENTAGE",
    value: "",
    startDate: "",
    endDate: "",
    maxUses: "",
    minOrderAmount: "0",
    prefix: "COUPON", // Prefix mặc định cho mã giảm giá
  });

  const generateCode = () => {
    const prefix = formData.prefix || "COUPON";
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const code = generateCode();

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/create`,
        {
          ...formData,
          code,
        },
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
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-5">Add New Coupon</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Prefix
            </label>
            <input
              type="text"
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="E.g.: COUPON, WELCOME, SUMMER, etc."
            />
            <p className="text-sm text-gray-500 mt-1">
              Coupon code will be generated automatically with format: {formData.prefix}XXXX
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={formData.type === "PERCENTAGE" ? "E.g.: 10" : "E.g.: 100000"}
              min="0"
              max={formData.type === "PERCENTAGE" ? "100" : undefined}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.type === "PERCENTAGE"
                ? "Enter discount percentage (0-100)"
                : "Enter discount amount (VND)"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validity Period
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Start date</p>
              </div>
              <div>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">End date</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Uses
            </label>
            <input
              type="number"
              name="maxUses"
              value={formData.maxUses}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="E.g.: 10"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Order Value (VND)
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="E.g.: 1000000"
              min="0"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;
