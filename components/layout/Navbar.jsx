"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import axios from "axios";
import { debounce } from "lodash";
import { formatPrice } from "@/utils/format";

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const { isSeller, router, user, currency, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/search`, {
        params: { query: value }
      });
      
      if (response.data.success) {
        setSearchResults(response.data.products);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Add debounce to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce((value) => handleSearch(value), 300),
    []
  );

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Trang chủ
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Cửa hàng
        </Link>
        <Link href="/all-blogs" className="hover:text-gray-900 transition">
          Bài viết
        </Link>
        <Link href="/about" className="hover:text-gray-900 transition">
          Về chúng tôi
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition">
          Liên hệ
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Quản trị
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 lg:gap-6">
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hover:text-gray-900 transition"
          >
            <SearchOutlinedIcon sx={{ fontSize: 20 }} />
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>

              {isSearching ? (
                <div className="p-4 text-center text-gray-500">Đang tìm...</div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((product) => {
                    // Lấy variant đầu tiên nếu có
                    const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
                    const displayImage = firstVariant && firstVariant.images && firstVariant.images.length > 0 ? firstVariant.images[0] : (product.image && product.image[0]);
                    const displayPrice = firstVariant ? firstVariant.price : product.price;
                    
                    return (
                      <div
                        key={product._id}
                        className="p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          router.push(`/product/${product._id}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={displayImage}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatPrice(displayPrice)}{currency}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : searchQuery && !isSearching ? (
                <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm</div>
              ) : null}
            </div>
          )}
        </div>

        <button
          onClick={() => router.push('/cart')}
          className="hover:text-gray-900 transition relative"
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
            {getCartCount()}
          </span>
        </button>

        <button
          onClick={() => router.push('/notification')}
          className="hover:text-gray-900 transition"
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
        </button>

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Sản phẩm yêu thích" 
                labelIcon={<FavoriteBorderOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/my-favorites')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Lịch sử đơn hàng" 
                labelIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/my-orders')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Địa chỉ" 
                labelIcon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/my-addresses')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Mã giảm giá" 
                labelIcon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/my-vouchers')}  
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
            Tài khoản
          </button>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        <button
          className="hover:text-gray-900 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Mở menu"
        >
          <MenuIcon sx={{ fontSize: 28 }} />
        </button>
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Quản trị
          </button>
        )}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Giỏ hàng" 
                labelIcon={<ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/cart')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Sản phẩm yêu thích" 
                labelIcon={<FavoriteBorderOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/my-favorites')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Lịch sử đơn hàng" 
                labelIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/my-orders')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Địa chỉ" 
                labelIcon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/my-addresses')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Mã giảm giá" 
                labelIcon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: 18 }} />} 
                onClick={() => router.push('/my-vouchers')}  
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
            Tài khoản
          </button>
        )}
      </div>
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Image
            className="w-28 cursor-pointer"
            onClick={() => { router.push('/'); setIsMenuOpen(false); }}
            src={assets.logo}
            alt="logo"
          />
          <button onClick={() => setIsMenuOpen(false)} aria-label="Đóng menu">
            <CloseIcon sx={{ fontSize: 28 }} />
          </button>
        </div>
        <div className="flex flex-col gap-2 px-6 py-4">
          <Link href="/" className="py-2" onClick={() => setIsMenuOpen(false)}>Trang chủ</Link>
          <Link href="/all-products" className="py-2" onClick={() => setIsMenuOpen(false)}>Cửa hàng</Link>
          <Link href="/all-blogs" className="py-2" onClick={() => setIsMenuOpen(false)}>Bài viết</Link>
          <Link href="/about" className="py-2" onClick={() => setIsMenuOpen(false)}>Về chúng tôi</Link>
          <Link href="/contact" className="py-2" onClick={() => setIsMenuOpen(false)}>Liên hệ</Link>
          {isSeller && (
            <button
              onClick={() => { router.push('/seller'); setIsMenuOpen(false); }}
              className="text-xs border px-4 py-1.5 rounded-full mt-2"
            >
              Quản trị
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
