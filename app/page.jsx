'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
// import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import TopBrands from "@/components/TopBrands";
import FlashSale from '@/components/FlashSale';
import NewProducts from '@/components/NewProducts';
import SaleProducts from '@/components/SaleProducts';
import HotProducts from '@/components/HotProducts';
import Services from "@/components/Services";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import HomeBlogs from "@/components/HomeBlogs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        {/* <HomeProducts /> */}
        <TopBrands />
        <NewProducts />
        <FlashSale />
        <SaleProducts />
        <Services />
        <HotProducts />
        <HomeBlogs />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
