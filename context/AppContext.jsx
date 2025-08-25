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
  
  // Track if data has been fetched to avoid duplicate requests
  const [dataFetched, setDataFetched] = useState({
    products: false,
    categories: false,
    brands: false,
    blogs: false,
    homeProducts: false,
    topBrands: false,
    homeBlogs: false,
    allReviews: false
  });

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
    if (dataFetched.products) return; // Skip if already fetched
    
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/list`);
      if (data.success) {
        setProducts(data.products);
        setDataFetched(prev => ({ ...prev, products: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBlogData = async () => {
    if (dataFetched.blogs) return;
    
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs/list`);
      if (data.success) {
        setBlogs(data.blogs);
        setDataFetched(prev => ({ ...prev, blogs: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchHomeProducts = async () => {
    if (dataFetched.homeProducts) return;
    
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/home`);
      if (data.success) {
        setNewProducts(data.newProducts);
        setSaleProducts(data.saleProducts);
        setHotProducts(data.hotProducts);
        setDataFetched(prev => ({ ...prev, homeProducts: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchHomeBlogs = async () => {
    if (dataFetched.homeBlogs) return;
    
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs/home`);
      if (data.success) {
        setHomeBlogs(data.homeBlogs);
        setDataFetched(prev => ({ ...prev, homeBlogs: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCategoryData = async () => {
    if (dataFetched.categories) return;
    
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/list`);
      if (data.success) {
        setCategories(data.categories);
        setDataFetched(prev => ({ ...prev, categories: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBrandData = async () => {
    if (dataFetched.brands) return;
    
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brands/list`);
      if (data.success) {
        setBrands(data.brands);
        setDataFetched(prev => ({ ...prev, brands: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchTopBrands = async () => {
    if (dataFetched.topBrands) return;
    
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brands/top`);
      if (data.success) {
        setTopBrands(data.topBrands);
        setDataFetched(prev => ({ ...prev, topBrands: true }));
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
    // Assuming 'users' and 'assets' are defined elsewhere or will be added
    // For now, returning a placeholder or null
    return null; 
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
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    const key = variantId ? `${productId}|${variantId}` : `${productId}|`;
    let cartData = structuredClone(cartItems);
    if (cartData[key]) {
      cartData[key] += 1;
    } else {
      cartData[key] = 1;
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
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
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
          toast.success("Cập nhật giỏ hàng thành công");
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

  const fetchReviews = async (productId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}`);
      if (data.success) {
        setReviews(data.reviews);
        setAllReviews(prev => ({ ...prev, [productId]: data.reviews }));
        setDataFetched(prev => ({ ...prev, allReviews: true }));
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

  const fetchAllReviews = async () => {
    if (dataFetched.allReviews) return;
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/all`);
      if (data.success) {
        // Chuyển đổi array thành object với key là productId
        const reviewsByProduct = {};
        data.reviews.forEach(review => {
          if (!reviewsByProduct[review.productId]) {
            reviewsByProduct[review.productId] = [];
          }
          reviewsByProduct[review.productId].push(review);
        });
        setAllReviews(reviewsByProduct);
        setDataFetched(prev => ({ ...prev, allReviews: true }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching all reviews:", error);
    }
  };

  const postReview = async (productId, content, ratingValue, token, orderId) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        { productId, content, ratingValue, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchReviews(productId);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const updateReview = async (reviewId, content, ratingValue, token, productId) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
        { content, ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        // Refresh reviews after update
        if (productId) {
          fetchReviews(productId);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
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
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (targetId, type, content, token, parentId = null) => {
    try {
      // Tạo payload dựa trên type
      const payload = {
        type,
        content,
        parentId
      };
      
      // Thêm productId hoặc blogId tùy theo type
      if (type === 'product') {
        payload.productId = targetId;
      } else if (type === 'blog') {
        payload.blogId = targetId;
      }
      
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchComments(targetId, type);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const updateComment = async (commentId, content, token, targetId, type) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        // Refresh comments after update
        if (targetId && type) {
          fetchComments(targetId, type);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const deleteComment = async (commentId, token, targetId, type) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        // Refresh comments after delete
        if (targetId && type) {
          fetchComments(targetId, type);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
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
    updateReview,
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
