export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getOrderStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'text-orange-600';
    case 'PROCESSING':
      return 'text-blue-600';
    case 'DELIVERED':
      return 'text-green-800';
    case 'CANCELLED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'text-orange-600';
    case 'PAID':
      return 'text-green-800';
    case 'REFUND_PENDING':
      return 'text-blue-600';
    case 'FAILED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const genOrderCode = (orderId) => {
  return `#${orderId.slice(-6)}`;
};
