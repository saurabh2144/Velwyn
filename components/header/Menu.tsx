// Menu.tsx
'use client';

import { ChevronDown, Moon, ShoppingCart, Sun, User, LogOut, History, Settings } from 'lucide-react';
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

  // Check screen size
  useEffect(() => {
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

  return (
    <div className="flex items-center gap-4">
      {/* Desktop Search Indicator - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        {/* Shopping Cart */}
        <Link
          href="/cart"
          className="btn btn-ghost btn-circle relative"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 badge badge-primary badge-sm min-w-[20px] h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </Link>
      </div>

      {/* User Menu */}
      {session && session.user ? (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost rounded-btn flex items-center gap-2">
            {isMobile ? (
              <User className="h-5 w-5" />
            ) : (
              <>
                <span className="hidden sm:block max-w-32 truncate">
                  {session.user.name}
                </span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </label>
          
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg border border-base-300"
          >
            {/* User Info */}
            <li className="menu-title">
              <span className="text-xs opacity-70">Signed in as</span>
              <span className="text-sm font-medium truncate">{session.user.email}</span>
            </li>
            <div className="divider my-1"></div>

            {/* Admin Link */}
            {session.user.isAdmin && (
              <li onClick={handleClick}>
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </li>
            )}

            {/* User Links */}
            <li onClick={handleClick}>
              <Link href="/order-history" className="flex items-center gap-3">
                <History className="h-4 w-4" />
                Order History
              </Link>
            </li>
            <li onClick={handleClick}>
              <Link href="/profile" className="flex items-center gap-3">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </li>
            
            <div className="divider my-1"></div>
            
            {/* Sign Out */}
            <li onClick={handleClick}>
              <button
                type="button"
                onClick={signOutHandler}
                className="flex items-center gap-3 text-error hover:text-error"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      ) : (
        // Sign In Button
        <button
          className="btn btn-primary btn-sm sm:btn-md"
          type="button"
          onClick={() => signIn()}
        >
          {isMobile ? 'Login' : 'Sign In'}
        </button>
      )}

      {/* Mobile Only Icons */}
      <div className="flex items-center gap-2 md:hidden">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>

        {/* Shopping Cart */}
        <Link
          href="/cart"
          className="btn btn-ghost btn-circle btn-sm relative"
          aria-label="Cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 badge badge-primary badge-xs min-w-[16px] h-4 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Menu;