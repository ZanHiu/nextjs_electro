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

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
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

export const countTimeFromNow = (date) => {
  const now = new Date();
  const inputDate = new Date(date);
  const diffInSeconds = Math.floor((now - inputDate) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  } else {
    return `${diffInYears} năm trước`;
  }
};
