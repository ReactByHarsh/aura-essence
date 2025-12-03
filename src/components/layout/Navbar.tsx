"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Search,
    ShoppingBag,
    User,
    Moon,
    Sun,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';
import { useThemeStore } from '@/stores/theme';
import { useCartStore } from '@/stores/cart';
import { useUser, useStackApp } from '@stackframe/stack';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fetchProducts } from '@/lib/api/products';
import type { Product } from '@/types';

// Helper function to get user initials
const getInitials = (email: string): string => {
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
};

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    const collectionsRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLFormElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const { theme, toggleTheme } = useThemeStore();
    const openCart = useCartStore(s => s.openCart);
    const loadCart = useCartStore(s => s.loadCart);
    const itemCount = useCartStore(s => s.items.reduce((t, i) => t + i.quantity, 0));
    const stackUser = useUser({ or: 'return-null' });
    const stackApp = useStackApp();
    const router = useRouter();

    // Load cart on mount and when auth user changes (only if authenticated)
    useEffect(() => {
        if (stackUser?.id) {
            loadCart().catch(() => { });
        }
    }, [loadCart, stackUser?.id]);

    // Convert Stack user to simplified user object
    const user = stackUser ? {
        id: stackUser.id,
        email: stackUser.primaryEmail || '',
        firstName: stackUser.displayName?.split(' ')[0] || '',
        lastName: stackUser.displayName?.split(' ').slice(1).join(' ') || '',
    } : null;

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (collectionsRef.current && !collectionsRef.current.contains(event.target as Node)) {
                setIsCollectionsOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Search handler with debouncing
    const handleSearchInput = (value: string) => {
        setSearchQuery(value);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (value.trim().length === 0) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        setShowSearchDropdown(true);
        setIsSearching(true);

        // Debounce search by 300ms
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                abortControllerRef.current = new AbortController();

                // Use API search instead of client-side filtering
                const searchResults = await fetchProducts({
                    search: value.trim(),
                    limit: 8,
                    signal: abortControllerRef.current.signal
                });
                setSearchResults(searchResults.products);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Search error:', error);
                    setSearchResults([]);
                }
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const collections = [
        { name: "Men's", slug: 'men' },
        { name: "Women's", slug: 'women' },
    ];

    const handleLogout = async () => {
        await stackApp.signOut();
        setIsUserMenuOpen(false);
        router.push('/');
    };

    return (
        <nav className="sticky top-0 z-40 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-slate-700/50 shadow-sm dark:shadow-slate-900/20 backdrop-blur-sm dark:backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="hover:opacity-80 transition-opacity group"
                        >
                            <span className="text-3xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
                                Aura Élixir
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Collections Dropdown */}
                        <div className="relative" ref={collectionsRef}>
                            <Button
                                variant="ghost"
                                className="flex items-center space-x-1 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
                                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                            >
                                <span>Collections</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isCollectionsOpen ? 'rotate-180' : ''}`} />
                            </Button>

                            {isCollectionsOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-slide-up">
                                    {collections.map(collection => (
                                        <Link
                                            key={collection.slug}
                                            href={`/collections/${collection.slug}`}
                                            className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
                                            onClick={() => setIsCollectionsOpen(false)}
                                        >
                                            {collection.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <form onSubmit={(e) => e.preventDefault()} className="relative hidden lg:block" ref={searchRef}>
                            <div className="flex items-center relative">
                                <Input
                                    type="search"
                                    placeholder="Search fragrances..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchInput(e.target.value)}
                                    onFocus={() => searchQuery && setShowSearchDropdown(true)}
                                    className="w-64 pl-10 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500 rounded-full bg-slate-50 dark:bg-slate-800/50 text-sm"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

                                {/* Search Dropdown */}
                                {showSearchDropdown && searchQuery.trim() && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 z-50 max-h-96 overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                                                <p className="mt-2 text-sm">Searching...</p>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="py-1">
                                                {searchResults.map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/product/${product.id}`}
                                                        onClick={() => {
                                                            setSearchQuery('');
                                                            setShowSearchDropdown(false);
                                                            setSearchResults([]);
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-b-0"
                                                    >
                                                        {product.images?.[0] && (
                                                            <div className="relative w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="40px"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                {product.brand}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                                                No products found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-1 md:space-x-4 pr-1 sm:pr-0">
                        {/* Theme toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            title="Toggle dark mode"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>

                        {/* User menu */}
                        <div className="relative" ref={userMenuRef}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                {user ? (
                                    // User avatar circle with initials
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-shadow">
                                        {getInitials(user.email || 'User')}
                                    </div>
                                ) : (
                                    <User className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                                )}
                            </Button>

                            {isUserMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600/50 py-2 z-50 animate-slide-up backdrop-blur-sm">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-t-lg">
                                                <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-300 font-semibold">Account</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1 truncate" title={user.email}>{user.email}</p>
                                            </div>
                                            <Link
                                                href="/account"
                                                className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                My Account
                                            </Link>
                                            <Link
                                                href="/orders"
                                                className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium border-t border-gray-200 dark:border-slate-600/50"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/handler/sign-in"
                                                className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href="/handler/sign-up"
                                                className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium border-t border-gray-200 dark:border-slate-600/50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 relative text-slate-700 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mr-1"
                            onClick={openCart}
                            title="Open shopping cart"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md ring-2 ring-white dark:ring-slate-900">
                                    {itemCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 dark:border-slate-800 py-4 space-y-4">
                        {/* Mobile search */}
                        <form onSubmit={(e) => e.preventDefault()} className="px-2 relative" ref={searchRef}>
                            <Input
                                type="search"
                                placeholder="Search fragrances..."
                                value={searchQuery}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                                className="w-full border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                            />

                            {/* Mobile search dropdown */}
                            {showSearchDropdown && searchQuery.trim() && (
                                <div className="absolute top-full left-2 right-2 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 z-50 max-h-64 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                                            <p className="mt-2 text-sm">Searching...</p>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="py-1">
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.id}`}
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setShowSearchDropdown(false);
                                                        setSearchResults([]);
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-b-0"
                                                >
                                                    {product.images && product.images[0] && (
                                                        <div className="w-10 h-10 flex-shrink-0 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="40px"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{product.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.brand}</p>
                                                    </div>
                                                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">₹{product.price}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                                            <p className="text-sm">No products found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>

                        {/* Mobile collections */}
                        <div className="px-2">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-widest">Collections</h3>
                            <div className="space-y-1">
                                {collections.map(collection => (
                                    <Link
                                        key={collection.slug}
                                        href={`/collections/${collection.slug}`}
                                        className="block text-sm text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors py-2 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {collection.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}