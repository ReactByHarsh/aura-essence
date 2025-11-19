"use client";
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-white border-t border-slate-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 inline-block font-serif">
              Aura Élixir
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Luxury fragrances crafted for the discerning individual. Experience the art of scent with our premium collection.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                title="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-bold text-white mb-6 text-xs uppercase tracking-widest">
              Collections
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link 
                  href="/collections/men" 
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center group"
                >
                  Men's Fragrances
                </Link>
              </li>
              <li>
                <Link 
                  href="/collections/women" 
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center group"
                >
                  Women's Fragrances
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-6 text-xs uppercase tracking-widest">
              Support
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link 
                  href="/contact" 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Aura Élixir
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping-policy" 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-6 text-xs uppercase tracking-widest">
              Legal
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-slate-400 hover:text-white transition-colors">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Aura Élixir. All rights reserved.</p>
          <p className="text-xs text-slate-600">Crafted with luxury and sophistication.</p>
        </div>
      </div>
    </footer>
  );
}