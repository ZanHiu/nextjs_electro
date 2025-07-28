import React from "react";
import HeaderSlider from "@/components/layout/HeaderSlider";
import Banner from "@/components/layout/Banner";
import TopBrands from "@/components/home/TopBrands";
import FlashSale from '@/components/home/FlashSale';
import NewProducts from '@/components/home/NewProducts';
import SaleProducts from '@/components/home/SaleProducts';
import HotProducts from '@/components/home/HotProducts';
import Services from "@/components/layout/Services";
import NewsLetter from "@/components/layout/NewsLetter";
import FeaturedProduct from "@/components/home/FeaturedProduct";
import HomeVouchers from "@/components/home/HomeVouchers";
import HomeBlogs from "@/components/home/HomeBlogs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import axios from "axios";

// Server-side data fetching function
async function getHomeData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Fetch all data in parallel for better performance
    const [productsRes, categoriesRes, brandsRes, blogsRes, homeProductsRes, topBrandsRes, homeBlogsRes, reviewsRes] = await Promise.all([
      axios.get(`${apiUrl}/products/list`),
      axios.get(`${apiUrl}/categories/list`),
      axios.get(`${apiUrl}/brands/list`),
      axios.get(`${apiUrl}/blogs/list`),
      axios.get(`${apiUrl}/home`),
      axios.get(`${apiUrl}/brands/top`),
      axios.get(`${apiUrl}/blogs/home`),
      axios.get(`${apiUrl}/reviews/all`)
    ]);

    return {
      products: productsRes.data.success ? productsRes.data.products : [],
      categories: categoriesRes.data.success ? categoriesRes.data.categories : [],
      brands: brandsRes.data.success ? brandsRes.data.brands : [],
      blogs: blogsRes.data.success ? blogsRes.data.blogs : [],
      homeProducts: homeProductsRes.data.success ? homeProductsRes.data : {},
      topBrands: topBrandsRes.data.success ? topBrandsRes.data.topBrands : [],
      homeBlogs: homeBlogsRes.data.success ? homeBlogsRes.data.homeBlogs : [],
      allReviews: reviewsRes.data.success ? reviewsRes.data.reviews : []
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    // Return empty data to prevent crashes
    return {
      products: [],
      categories: [],
      brands: [],
      blogs: [],
      homeProducts: {},
      topBrands: [],
      homeBlogs: [],
      allReviews: []
    };
  }
}

const Home = async () => {
  // Fetch data on server-side
  const homeData = await getHomeData();

  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <TopBrands initialData={homeData.topBrands} />
        <NewProducts initialData={homeData.homeProducts.newProducts} />
        <FlashSale />
        <SaleProducts initialData={homeData.homeProducts.saleProducts} />
        <Services />
        <HotProducts initialData={homeData.homeProducts.hotProducts} />
        <HomeVouchers />
        <HomeBlogs initialData={homeData.homeBlogs} />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
