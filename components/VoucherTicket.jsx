import React from "react";
import { formatDate, formatPrice } from "@/utils/format";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

const copyToClipboard = (text) => {
  if (!text) return;
  const success = copy(text);
  if (success) {
    toast.success("Coupon code copied!");
  } else {
    toast.error("Failed to copy code!");
  }
};

const VoucherTicket = ({ item, currency, small }) => {
  const statusMap = {
    USED: { label: "Used", color: "bg-gray-300 text-gray-600" },
    EXPIRED: { label: "Expired", color: "bg-red-200 text-red-700" },
    DEFAULT: { label: "Unused", color: "bg-green-100 text-green-800" },
  };
  const status = statusMap[item.status] || statusMap.DEFAULT;

  // Chỉ disable nếu đã dùng hoặc hết hạn
  const isDisabled = item.status === 'USED' || item.status === 'EXPIRED';

  // Kích thước nhỏ hơn nếu prop small true
  const iconSize = small ? 40 : 56;
  const codeFont = small ? "text-base" : "text-lg";
  const valueFont = small ? "text-xs" : "text-sm";
  const padding = small ? "p-2" : "p-4";
  const minH = small ? "min-h-[90px]" : "min-h-[120px]";

  return (
    <div className={`relative flex flex-col md:flex-row items-stretch bg-white rounded-xl shadow-md overflow-hidden border border-dashed border-orange-300 ${minH}`}>
      {/* Notch effect */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-r-full border-r border-orange-200 z-10 hidden md:block" style={{boxShadow: '2px 0 6px -2px #f59e42'}}></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-l-full border-l border-orange-200 z-10 hidden md:block" style={{boxShadow: '-2px 0 6px -2px #f59e42'}}></div>
      {/* Icon */}
      <div className={`flex items-center justify-center md:w-20 w-full bg-orange-50 ${padding} md:border-r border-orange-100`}>
        <ConfirmationNumberOutlinedIcon sx={{ fontSize: iconSize }} />
      </div>
      {/* Info */}
      <div className={`flex-1 flex flex-col justify-between ${padding} gap-1`}> 
        <div className="flex flex-col md:flex-row md:items-center md:gap-2 gap-1">
          <span className={`font-bold text-orange-600 tracking-widest select-all ${codeFont}`}>
            {item.couponId?.code}
          </span>
          <span className="inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-semibold ml-0 md:ml-2">
            {item.couponId?.type === 'PERCENTAGE'
              ? `Discount ${item.couponId.value}%`
              : `Discount ${formatPrice(item.couponId?.value)}${currency}`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>
            Valid: {formatDate(item.couponId?.startDate)} - {formatDate(item.couponId?.endDate)}
          </span>
          {item.couponId?.minOrderAmount > 0 && (
            <span>
              Minimum order: {formatPrice(item.couponId?.minOrderAmount)}{currency}
            </span>
          )}
          {item.prizeInfo?.desc && (
            <span className="text-green-600">🎁 {item.prizeInfo.desc}</span>
          )}
        </div>
      </div>
      {/* Actions */}
      <div className={`flex flex-col justify-between items-end md:w-28 w-full ${padding} gap-2 bg-gray-50 border-l border-orange-100`}>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
        <button
          className="mt-1 px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-xs font-medium shadow transition"
          onClick={() => copyToClipboard(item.couponId?.code)}
          disabled={isDisabled}
        >
          Copy code
        </button>
      </div>
    </div>
  );
};

export default VoucherTicket;
