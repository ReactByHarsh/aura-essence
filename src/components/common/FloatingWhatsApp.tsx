"use client";
import React from 'react';
import { Phone } from 'lucide-react';

export function FloatingWhatsApp() {
    return (
        <a
            href="https://wa.me/919028709575?text=Hi%20Aura%20Elixir%2C%20I%20have%20a%20question%20about..."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            <Phone className="h-6 w-6 fill-white" />
            <span className="absolute right-full mr-3 bg-white text-slate-900 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
                Chat with us
            </span>
        </a>
    );
}
