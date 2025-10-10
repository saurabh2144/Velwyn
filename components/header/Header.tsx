'use client';

import { AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import Menu from './Menu';
import { SearchBox } from './SearchBox';

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <nav>
        {/* Main Navbar */}
        <div className="navbar justify-between px-4 py-3 bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
          {/* Mobile Menu Button and Logo */}
          <div className="flex items-center justify-between flex-1 md:flex-none gap-2">
            <label 
              htmlFor="my-drawer" 
              className="btn btn-square btn-ghost drawer-button lg:hidden"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <AlignJustify className="h-5 w-5" />
            </label>

            <Link
              href="/"
              className="text-xl font-bold ml-2 text-black dark:text-white hover:text-primary/80 dark:hover:text-gray-300 transition-colors"
            >
              Velwyn
            </Link>
          </div>

          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-4">
            <SearchBox />
          </div>

          {/* Menu Items */}
          <div className="flex-none">
            <Menu />
          </div>
        </div>

        {/* Mobile Search - Shows below navbar on mobile */}
        <div className="bg-base-200 dark:bg-gray-800 py-3 px-4 border-t border-base-300 dark:border-gray-700 lg:hidden">
          <div className="flex justify-center">
            <SearchBox />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
