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

export const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'PAID':
      return 'text-green-600';
    case 'PENDING':
      return 'text-yellow-600';
    case 'FAILED':
      return 'text-red-600';
    case 'REFUND_PENDING':
      return 'text-orange-600';
    case 'REFUNDED':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

export const getOrderStatusColor = (status) => {
  switch (status) {
    case 'PROCESSING':
      return 'text-blue-600';
    case 'SHIPPING':
      return 'text-yellow-600';
    case 'DELIVERED':
      return 'text-green-600';
    case 'COMPLETED':
      return 'text-green-700';
    case 'CANCELLED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
