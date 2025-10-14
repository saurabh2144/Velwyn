// components/Menu.tsx
'use client';

import { ChevronDown, Moon, ShoppingCart, Sun, User, LogOut, History, Settings, Heart } from 'lucide-react';
import Link from 'next/link';
import { signOut, signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import useCartService from '@/lib/hooks/useCartStore';
import useLayoutService from '@/lib/hooks/useLayout';

const Menu = () => {
  const { items, init } = useCartService();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useLayoutService();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check screen size and set mounted
  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const signOutHandler = () => {
    signOut({ callbackUrl: '/signin' });
    init();
  };

  const handleClick = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  const cartItemsCount = items.reduce((a, c) => a + c.qty, 0);

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="skeleton w-8 h-8 rounded-full"></div>
        <div className="skeleton w-8 h-8 rounded-full"></div>
        <div className="skeleton w-8 h-8 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Desktop Icons - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="btn btn-ghost btn-circle btn-sm relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Wishlist"
        >
          <Heart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 badge badge-primary badge-xs bg-blue-600 dark:bg-blue-500 text-white">0</span>
        </Link>

        {/* Shopping Cart */}
        <Link
          href="/cart"
          className="btn btn-ghost btn-circle btn-sm relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 badge badge-primary badge-xs min-w-[20px] h-5 flex items-center justify-center text-xs bg-blue-600 dark:bg-blue-500 text-white">
              {cartItemsCount}
            </span>
          )}
        </Link>
      </div>

      {/* User Menu */}
      {session && session.user ? (
        <div className="dropdown dropdown-end">
          <label 
            tabIndex={0} 
            className="btn btn-ghost btn-circle btn-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="User menu"
          >
            <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </label>
          
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] mt-3 w-56 rounded-box bg-white dark:bg-gray-800 p-2 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {/* User Info */}
            <li className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Signed in as</span>
                <span className="text-sm font-medium truncate text-gray-900 dark:text-white">{session.user.name || session.user.email}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</span>
              </div>
            </li>

            {/* Admin Link */}
            {session.user.isAdmin && (
              <li onClick={handleClick}>
                <Link href="/admin/dashboard" className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            )}

            {/* User Links */}
            <li onClick={handleClick}>
              <Link href="/order-history" className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <History className="h-4 w-4" />
                <span>Order History</span>
              </Link>
            </li>
            <li onClick={handleClick}>
              <Link href="/profile" className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </li>
            
            <div className="divider my-1"></div>
            
            {/* Wishlist - Mobile only in dropdown */}
            <li onClick={handleClick} className="md:hidden">
              <Link href="/wishlist" className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Heart className="h-4 w-4" />
                <span>Wishlist</span>
              </Link>
            </li>
            
            {/* Sign Out */}
            <li onClick={handleClick}>
              <button
                type="button"
                onClick={signOutHandler}
                className="flex items-center gap-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      ) : (
        // Sign In Button
        <div className="flex items-center gap-2">
          <button
            className="btn btn-primary btn-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white border-0"
            type="button"
            onClick={() => signIn()}
          >
            {isMobile ? 'Login' : 'Sign In'}
          </button>
        </div>
      )}

      {/* Mobile Only Icons - Visible only on mobile */}
      <div className="flex items-center gap-1 md:hidden">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Wishlist - Only show if user is logged in on mobile */}
        {session && session.user && (
          <Link
            href="/wishlist"
            className="btn btn-ghost btn-circle btn-sm relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            <span className="absolute -top-0.5 -right-0.5 badge badge-primary badge-xs bg-blue-600 dark:bg-blue-500 text-white">0</span>
          </Link>
        )}

        {/* Shopping Cart */}
        <Link
          href="/cart"
          className="btn btn-ghost btn-circle btn-sm relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 badge badge-primary badge-xs min-w-[16px] h-4 flex items-center justify-center text-[10px] bg-blue-600 dark:bg-blue-500 text-white">
              {cartItemsCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Menu;