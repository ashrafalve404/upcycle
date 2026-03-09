'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.account_type === 'admin') return '/admin';
    if (user.account_type === 'designer') return '/designer-dashboard';
    return '/dashboard';
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md dark:border-gray-700">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600">UpCycle</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/marketplace" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Marketplace
          </Link>
          <Link href="/designers" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Designers
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link href={getDashboardLink()}>
                <Button variant="ghost" className="hidden sm:inline-flex dark:text-gray-300">
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" className="dark:text-gray-300">
                  Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex dark:text-gray-300">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
