"use client";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();
  const { signOut, openSignIn } = useClerk();

  const [products, setProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [homeBlogs, setHomeBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUserPurchasedProduct, setHasUserPurchasedProduct] = useState(false);
  const [favoriteProductIds, setFavoriteProductIds] = useState([]);

  // Hàm xử lý khi token hết hạn
  const handleTokenExpired = async () => {
    toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    await signOut();
    openSignIn();
  };

  // Interceptor cho axios để tự động logout khi token hết hạn
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.data?.code === 'TOKEN_EXPIRED') {
          handleTokenExpired();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const refreshFavoriteProducts = async () => {
    if (!user) {
      setFavoriteProductIds([]);
      return;
    }
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        setFavoriteProductIds(data.favorites.map(p => p._id));
      } else {
        setFavoriteProductIds([]);
      }
    } catch (error) {
      setFavoriteProductIds([]);
    }
  };

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/list`);
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs/list`);
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchHomeProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/home`);
      if (data.success) {
        setNewProducts(data.newProducts);
        setSaleProducts(data.saleProducts);
        setHotProducts(data.hotProducts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchHomeBlogs = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs/home`);
      if (data.success) {
        setHomeBlogs(data.homeBlogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/list`);
      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBrandData = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brands/list`);
      if (data.success) {
        setBrands(data.brands);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchTopBrands = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brands/top`);
      if (data.success) {
        setTopBrands(data.topBrands);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getBrandName = (brandId) => {
    const brand = brands.find(b => b.brandId === brandId);
    return brand ? brand.name : "Unknown Brand";
  };

  const getCategoryName = (cateId) => {
    const category = categories.find(c => c.cateId === cateId);
    return category ? category.name : "Unknown Category";
  };

  const getUserAvatar = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.avatar : assets.default_avatar;
  };

  const fetchUserData = async () => {
    try {
      if (!user) return;

      if (user.publicMetadata.role === "seller") {
        setIsSeller(true);
      }
      
      const token = await getToken();
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        // If user not found in DB, wait briefly and retry
        setTimeout(fetchUserData, 1000);
      }
    } catch (error) {
      setTimeout(fetchUserData, 1000);
    }
  };

  const addToCart = async (productId, variantId = null) => {
    const key = variantId ? `${productId}|${variantId}` : `${productId}|`;
    let cartData = structuredClone(cartItems);
    if (cartData[key]) {
      cartData[key] += 1;
    } else {
      cartData[key] = 1;
    }
    setCartItems(cartData);
    // if (!user) {
    //   localStorage.setItem("cart", JSON.stringify(cartData));
    // }
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/update`,
          { cartData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Item added to cart");
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (user) {
        try {
          const token = await getToken();
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/update`,
            { cartData },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success("Cart updated");
        } catch (error) {
          toast.error(error.response?.data?.message || error.message);
        }
      }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      const [productId, variantId] = key.split('|');
      const product = products.find((product) => product._id === productId);
      let price = 0;
      if (product) {
        if (variantId) {
          const variant = (product.variants || []).find(v => v._id === variantId);
          price = variant ? variant.offerPrice : 0;
        } else {
          price = product.offerPrice;
        }
        totalAmount += price * cartItems[key];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const fetchAllReviews = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/all`);
      if (data.success) {
        // Chuyển đổi array thành object với key là productId
        const reviewsByProduct = {};
        data.reviews.forEach(review => {
          if (!reviewsByProduct[review.targetId]) {
            reviewsByProduct[review.targetId] = [];
          }
          reviewsByProduct[review.targetId].push(review);
        });
        setAllReviews(reviewsByProduct);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching all reviews:", error);
    }
  };

  const getProductReviewCount = (productId) => {
    const productReviews = allReviews[productId] || [];
    const reviewsWithRating = productReviews.filter(review => review.ratingValue > 0);
    return reviewsWithRating.length;
  };

  const getProductReviewAmount = (productId) => {
    const productReviews = allReviews[productId] || [];
    const reviewsWithRating = productReviews.filter(review => review.ratingValue > 0);
    const totalRating = reviewsWithRating.reduce((sum, review) => sum + review.ratingValue, 0);
    return reviewsWithRating.length > 0 ? totalRating / reviewsWithRating.length : 0;
  };

  const fetchReviews = async (targetId, type = 'product') => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${type}/${targetId}`);
      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getReviewCount = (reviews) => {
    const reviewsWithRating = reviews.filter(review => review.ratingValue > 0);
    return reviewsWithRating.length;
  };

  const getReviewAmount = (reviews) => {
    const reviewsWithRating = reviews.filter(review => review.ratingValue > 0);
    const totalRating = reviewsWithRating.reduce((sum, review) => sum + review.ratingValue, 0);
    return reviewsWithRating.length > 0 ? totalRating / reviewsWithRating.length : 0;
  };

  const postReview = async (targetId, type = 'product', content, ratingValue, token, orderId) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${type}`,
        { targetId, content, ratingValue, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReviews(targetId, type);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const checkUserProductPurchaseStatus = async (productId, token) => {
    if (!token) {
      setHasUserPurchasedProduct(false);
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/check-purchase/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasUserPurchasedProduct(data.hasPurchased);
    } catch (err) {
      console.error("Error checking purchase status:", err);
      setHasUserPurchasedProduct(false);
    }
  };

  const fetchComments = async (targetId, type = 'product') => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/${type}/${targetId}`);
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (targetId, type, content, token, parentId = null) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        { targetId, type, content, parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(parentId ? "Trả lời thành công!" : "Bình luận thành công!");
        fetchComments(targetId, type);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateComment = async (commentId, content, token) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Cập nhật bình luận thành công!");
        // Refresh comments after update
        const comment = comments.find(c => c._id === commentId);
        if (comment) {
          fetchComments(comment.targetId, comment.type);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteComment = async (commentId, token) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Xóa bình luận thành công!");
        // Refresh comments after delete
        const comment = comments.find(c => c._id === commentId);
        if (comment) {
          fetchComments(comment.targetId, comment.type);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchCategoryData();
    fetchBrandData();
    fetchBlogData();
    fetchHomeProducts();
    fetchTopBrands();
    fetchHomeBlogs();
    fetchAllReviews();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      refreshFavoriteProducts();
    } else {
      // Reset user data when logged out
      setUserData(false);
      setCartItems({});
      setIsSeller(false);
      setFavoriteProductIds([]);
    }
  }, [user]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    getUserAvatar,
    products,
    fetchProductData,
    saleProducts,
    newProducts,
    hotProducts,
    fetchHomeProducts,
    categories,
    fetchCategoryData,
    brands,
    fetchBrandData,
    topBrands,
    fetchTopBrands,
    getBrandName,
    getCategoryName,
    blogs,
    fetchBlogData,
    homeBlogs,
    fetchHomeBlogs,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    reviews,
    allReviews,
    loading,
    fetchReviews,
    fetchAllReviews,
    postReview,
    getReviewCount,
    getReviewAmount,
    getProductReviewCount,
    getProductReviewAmount,
    hasUserPurchasedProduct,
    checkUserProductPurchaseStatus,
    comments,
    fetchComments,
    postComment,
    updateComment,
    deleteComment,
    favoriteProductIds,
    refreshFavoriteProducts,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
