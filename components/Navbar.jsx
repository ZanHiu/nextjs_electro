"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon, AddressIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import axios from "axios";
import { debounce } from "lodash";
// import { debounce } from "@/utils/helpers";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShopOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button 
            className="hover:text-gray-900 transition flex items-center gap-1"
            onClick={() => setIsShopOpen(!isShopOpen)}
          >
            Shop
            <Image
              className={`h-2.5 w-[100%] transition-transform ${isShopOpen ? 'rotate-180' : ''}`}
              src={assets.dropdown_arrow}
              alt="dropdown_arrow"
            />
          </button>
          
          {isShopOpen && (
            <div 
              className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-2 min-w-[160px] z-50"
            >
              <Link 
                href="/all-products" 
                className="block px-4 py-2 hover:bg-gray-50 hover:text-orange-600 transition"
                onClick={() => setIsShopOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/all-categories" 
                className="block px-4 py-2 hover:bg-gray-50 hover:text-orange-600 transition"
                onClick={() => setIsShopOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/all-brands" 
                className="block px-4 py-2 hover:bg-gray-50 hover:text-orange-600 transition"
                onClick={() => setIsShopOpen(false)}
              >
                Brands
              </Link>
            </div>
          )}
        </div>
        <Link href="/all-blogs" className="hover:text-gray-900 transition">
          Blog
        </Link>
        <Link href="/about" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        {/* <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" /> */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hover:text-gray-900 transition"
          >
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search products..."
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
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
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
                          src={product.image[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            ${product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery && !isSearching ? (
                <div className="p-4 text-center text-gray-500">No products found</div>
              ) : null}
            </div>
          )}
        </div>
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Cart" 
                labelIcon={<CartIcon />} 
                onClick={() => router.push('/cart')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="My Orders" 
                labelIcon={<BagIcon />} 
                onClick={() => router.push('/my-orders')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="My Addresses" 
                labelIcon={<AddressIcon />} 
                onClick={() => router.push('/my-addresses')} 
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Home" 
                labelIcon={<HomeIcon />} 
                onClick={() => router.push('/')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Products" 
                labelIcon={<BoxIcon />} 
                onClick={() => router.push('/all-products')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Cart" 
                labelIcon={<CartIcon />} 
                onClick={() => router.push('/cart')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="My Orders" 
                labelIcon={<BagIcon />} 
                onClick={() => router.push('/my-orders')} 
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
