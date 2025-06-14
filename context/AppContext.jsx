"use client";
import { useAuth, useUser } from "@clerk/nextjs";
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
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUserPurchasedProduct, setHasUserPurchasedProduct] = useState(false);

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
      // If error occurs, wait briefly and retry
      setTimeout(fetchUserData, 1000);
    }
  };

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
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
        toast.error(error.message);
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
          toast.error(error.message);
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
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
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
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      // Reset user data when logged out
      setUserData(false);
      setCartItems({});
      setIsSeller(false);
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
    loading,
    fetchReviews,
    postReview,
    getReviewCount,
    getReviewAmount,
    hasUserPurchasedProduct,
    checkUserProductPurchaseStatus,
    comments,
    fetchComments,
    postComment,
    updateComment,
    deleteComment,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
