"use client";
import React from 'react';

export function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Premium Hero Section - Clean */}
      <section className="relative py-16 sm:py-24 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
            <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase">GET IN TOUCH</span>
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight font-serif">
            Contact Information
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Contact Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 sm:p-12">
          <div className="space-y-10">
            {/* Name */}
            <div className="text-center sm:text-left border-b border-slate-100 dark:border-slate-800 pb-8">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
                Harshavardhan Shinde
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Founder & Owner</p>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {/* Phone */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-5 w-5 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm uppercase tracking-wide">Contact Us</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    9028709575
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-5 w-5 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm uppercase tracking-wide">Email Us</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    help@auraelixir.co.in
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-5 w-5 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm uppercase tracking-wide">Business Hours</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    09:30 AM - 6:00 PM IST
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-5 w-5 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-sm uppercase tracking-wide">Address</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    Balaji Colony, Barshi - 413401<br />Maharashtra, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-slate-50 dark:bg-slate-900 border-l-4 border-amber-500 p-6 rounded-r-lg shadow-sm">
          <p className="text-slate-700 dark:text-slate-300 text-base">
            We're here to help! Reach out to us with any questions about our luxury fragrances or services. Our team is ready to assist you during business hours.
          </p>
        </div>
      </div>
    </div>
  );
}