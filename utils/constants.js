// Order
export const OrderStatus = {
  PENDING: 'CHƯA XỬ LÝ',
  PROCESSING: 'ĐANG XỬ LÝ',
  DELIVERED: 'ĐÃ GIAO',
  CANCELLED: 'ĐÃ HỦY',
};

// Payment
export const PaymentStatus = {
  PENDING: 'CHƯA THANH TOÁN',
  PAID: 'ĐÃ THANH TOÁN',
  FAILED: 'THẤT BẠI',
  REFUND_PENDING: 'ĐANG HOÀN TIỀN',
};

// Sort options
export const SortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
];

// Variant labels
export const VariantLabels = {
  color: 'Màu sắc',
  ram: 'RAM',
  rom: 'ROM',
  cpu: 'CPU',
  vga: 'VGA',
  os: 'Hệ điều hành',
  pin: 'Pin',
  manhinh: 'Màn hình',
  camera: 'Camera',
};
