// components/Header.tsx
'use client';

import { AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import Menu from './Menu';
import { SearchBox } from './SearchBox';

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-lg bg-white dark:bg-gray-900">
      <nav>
        {/* Main Navbar */}
        <div className="navbar justify-between px-4 py-3 bg-white dark:bg-gray-900 text-black dark:text-white">
          {/* Mobile Menu Button and Logo */}
          <div className="flex items-center gap-2 md:flex-none">
            <label 
              htmlFor="my-drawer" 
              className="btn btn-square btn-ghost drawer-button lg:hidden p-2"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <AlignJustify className="h-5 w-5" />
            </label>

            <Link
              href="/"
              className="text-xl font-bold text-black dark:text-white hover:text-primary/80 dark:hover:text-gray-300 transition-colors"
            >
              Velwyn
            </Link>
          </div>

          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <SearchBox />
          </div>

          {/* Menu Items - Improved for mobile */}
          <div className="flex-none">
            <div className="flex items-center gap-1 sm:gap-2">
              <Menu />
            </div>
          </div>
        </div>

        {/* Mobile Search - Shows below navbar on mobile */}
        <div className="lg:hidden bg-gray-50 dark:bg-gray-800 py-3 px-4 border-t border-gray-200 dark:border-gray-700">
          <div className="w-full">
            <SearchBox />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;