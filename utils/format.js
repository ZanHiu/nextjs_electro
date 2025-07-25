export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '0';
  return price.toLocaleString('vi-VN');
};

export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('vi-VN', options);
};

export const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString('vi-VN', options);
};

export const formatDateTime = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleString('vi-VN', options);
};
