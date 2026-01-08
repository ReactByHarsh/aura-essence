"use client";
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-primary-950 text-neutral-300 border-t border-accent-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-50 mb-4 inline-block font-serif">
              Aura Élixir
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-light">
              Luxury fragrances crafted for the discerning individual. Experience the art of scent with our premium collection.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/auraelixir"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-accent-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                title="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/auraelixir.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-accent-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-accent-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-accent-500 mb-6 text-xs uppercase tracking-widest">
              Collections
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/collections/men" className="text-neutral-400 hover:text-accent-300 transition-colors inline-flex items-center group">
                  Men's Fragrances
                </Link>
              </li>
              <li>
                <Link href="/collections/women" className="text-neutral-400 hover:text-accent-300 transition-colors inline-flex items-center group">
                  Women's Fragrances
                </Link>
              </li>
              <li>
                <Link href="/collections/unisex" className="text-neutral-400 hover:text-accent-300 transition-colors inline-flex items-center group">
                  Unisex Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Trust Signal) */}
          <div>
            <h3 className="font-bold text-accent-500 mb-6 text-xs uppercase tracking-widest">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent-600 shrink-0" />
                <span>Balaji Colony, Barshi,<br />Maharashtra 413401, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent-600 shrink-0" />
                <a href="tel:+919028709575" className="hover:text-accent-300 transition-colors">+91-9028709575</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent-600 shrink-0" />
                <a href="mailto:help@auraelixir.co.in" className="hover:text-accent-300 transition-colors">help@auraelixir.co.in</a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="font-bold text-accent-500 mb-6 text-xs uppercase tracking-widest">
              Customer Care
            </h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/shipping-policy" className="text-neutral-400 hover:text-accent-300 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="text-neutral-400 hover:text-accent-300 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/privacy" className="text-neutral-400 hover:text-accent-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-400 hover:text-accent-300 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Payments & Trust Badges */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-500">&copy; {new Date().getFullYear()} Aura Élixir. All rights reserved.</p>
              <p className="text-xs text-neutral-600">Registered in India. FSSAI & ISO Certified facilities.</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Payment Icons Simulation */}
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:border-accent-500/30 transition-colors">
                <span className="text-xs text-neutral-400 font-medium mr-2">We Accept:</span>
                <div className="flex gap-2 opacity-90">
                  <span className="text-[10px] font-bold bg-white text-blue-900 px-1.5 py-0.5 rounded shadow-sm">VISA</span>
                  <span className="text-[10px] font-bold bg-white text-orange-600 px-1.5 py-0.5 rounded shadow-sm">MC</span>
                  <span className="text-[10px] font-bold bg-white text-blue-600 px-1.5 py-0.5 rounded shadow-sm">UPI</span>
                  <span className="text-[10px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded shadow-sm">PhonePe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}