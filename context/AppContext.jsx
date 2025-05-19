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
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
