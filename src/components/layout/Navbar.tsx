"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Search,
    ShoppingBag,
    User,
    Menu,
    X,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { useUser, useStackApp } from '@stackframe/stack';
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
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const openCart = useCartStore(s => s.openCart);
    const loadCart = useCartStore(s => s.loadCart);
    const itemCount = useCartStore(s => s.items.reduce((t, i) => t + i.quantity, 0));
    const stackUser = useUser({ or: 'return-null' });
    const stackApp = useStackApp();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
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

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();

        if (value.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                abortControllerRef.current = new AbortController();
                const results = await fetchProducts({
                    search: value.trim(),
                    limit: 5,
                    signal: abortControllerRef.current.signal
                });
                setSearchResults(results.products);
            } catch (error: any) {
                if (error.name !== 'AbortError') setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const handleLogout = async () => {
        await stackApp.signOut();
        setIsUserMenuOpen(false);
        router.push('/');
    };

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-accent-900 text-accent-100 text-xs font-medium py-2 text-center tracking-widest uppercase border-b border-accent-800/50">
                <span className="animate-pulse-subtle">✨ Buy 2 Get 1 Free | Free Shipping on Prepaid Orders ✨</span>
            </div>

            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-primary-950/90 backdrop-blur-md shadow-2xl border-b border-primary-800' : 'bg-transparent border-b border-white/10'
                } mt-8`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-neutral-100 p-2">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>

                        {/* Navigation Links (Left) */}
                        <div className="hidden md:flex items-center space-x-8">
                            {[
                                { name: 'Shop Men', href: '/collections/men' },
                                { name: 'Shop Women', href: '/collections/women' },
                                //{ name: 'Unisex', href: '/collections/unisex' },
                                //{ name: 'Discovery Sets', href: '/collections/discovery-sets' },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-neutral-300 hover:text-accent-400 transition-colors tracking-wide uppercase"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Logo (Center) */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-40 text-center flex justify-center z-10 pointer-events-none md:pointer-events-auto">
                            <Link href="/" className="pointer-events-auto">
                                <span className="text-xl md:text-3xl font-serif font-bold text-neutral-50 tracking-wider whitespace-nowrap">
                                    Aura Élixir
                                </span>
                            </Link>
                        </div>

                        {/* Actions (Right) */}
                        <div className="flex items-center space-x-6">
                            {/* Search Icon */}
                            <div className="relative" ref={searchRef}>
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                                >
                                    <Search size={20} />
                                </button>
                                {isSearchOpen && (
                                    <div className="absolute right-0 mt-4 w-80 bg-primary-900 border border-primary-700 rounded-sm shadow-2xl p-4">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearchInput(e.target.value)}
                                            className="w-full bg-primary-800 text-neutral-100 px-4 py-2 text-sm border border-primary-700 focus:border-accent-500 outline-none placeholder:text-neutral-500"
                                            autoFocus
                                        />
                                        {/* Search Results Dropdown */}
                                        {searchQuery && (
                                            <div className="mt-2 max-h-60 overflow-y-auto">
                                                {isSearching ? (
                                                    <p className="text-xs text-neutral-500 text-center py-2">Searching...</p>
                                                ) : searchResults.length > 0 ? (
                                                    searchResults.map(p => (
                                                        <Link key={p.id} href={`/product/${p.id}`} className="flex items-center gap-3 p-2 hover:bg-primary-800 transition-colors">
                                                            {p.images?.[0] && (
                                                                <Image src={p.images[0]} alt={p.name} width={32} height={32} className="rounded-sm object-cover" />
                                                            )}
                                                            <div className="text-sm">
                                                                <p className="text-neutral-200">{p.name}</p>
                                                                <p className="text-accent-400 text-xs">₹{p.price}</p>
                                                            </div>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-neutral-500 text-center py-2">No results.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Account */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="text-neutral-300 hover:text-accent-400 transition-colors"
                                >
                                    {user ? (
                                        <div className="w-8 h-8 rounded-full bg-accent-600 text-primary-950 flex items-center justify-center text-xs font-bold">
                                            {getInitials(user.email)}
                                        </div>
                                    ) : (
                                        <User size={20} />
                                    )}
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-4 w-48 bg-primary-900 border border-primary-700 shadow-xl py-2">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-2 border-b border-primary-800">
                                                    <p className="text-xs text-accent-400 uppercase tracking-wider">Signed in as</p>
                                                    <p className="text-sm text-neutral-200 truncate">{user.email}</p>
                                                </div>
                                                <Link href="/account" className="block px-4 py-2 text-sm text-neutral-300 hover:bg-primary-800 hover:text-accent-400">Account</Link>
                                                <Link href="/orders" className="block px-4 py-2 text-sm text-neutral-300 hover:bg-primary-800 hover:text-accent-400">Orders</Link>
                                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-primary-800">Sign Out</button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/handler/sign-in" className="block px-4 py-2 text-sm text-neutral-300 hover:bg-primary-800 hover:text-accent-400">Sign In</Link>
                                                <Link href="/handler/sign-up" className="block px-4 py-2 text-sm text-neutral-300 hover:bg-primary-800 hover:text-accent-400">Create Account</Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <button onClick={openCart} className="text-neutral-300 hover:text-accent-400 transition-colors relative">
                                <ShoppingBag size={20} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent-500 text-primary-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-primary-950 border-t border-primary-800 p-6 flex flex-col space-y-4 shadow-2xl">
                        {[
                            { name: 'Shop Men', href: '/collections/men' },
                            { name: 'Shop Women', href: '/collections/women' },
                            //{ name: 'Unisex', href: '/collections/unisex' },
                            //{ name: 'Discovery Sets', href: '/collections/discovery-sets' },
                        ].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg font-medium text-neutral-300 hover:text-accent-400 border-b border-primary-800 pb-2"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </>
    );
}