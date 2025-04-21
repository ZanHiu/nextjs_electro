import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const PaymentFailed = () => {
  const router = useRouter();
  const { message } = router.query;

  useEffect(() => {
    if (message) {
      toast.error(message || 'Payment failed. Please try again.');
      setTimeout(() => {
        router.push('/cart');
      }, 3000);
    }
  }, [message, router]);

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
