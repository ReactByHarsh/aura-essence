"use client";
import React from 'react';

export function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Premium Hero Section - Clean */}
      <section className="relative py-12 sm:py-16 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-3">
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
            <span className="text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase">POLICIES</span>
            <div className="h-[1px] w-8 bg-amber-500/50"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 sm:mb-4 leading-tight font-serif">
            Shipping Policy
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="prose prose-lg max-w-none text-slate-600 dark:text-slate-300">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
            Last updated: January 25, 2025
          </p>

          {/* Business Information Box */}
          <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 font-serif">Business Information</h3>
            <div className="space-y-2">
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong className="font-semibold text-slate-900 dark:text-white">Business Name:</strong> Aura Elixir</p>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong className="font-semibold text-slate-900 dark:text-white">Managed by:</strong> Harshavardhan Shinde</p>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong className="font-semibold text-slate-900 dark:text-white">Email:</strong> help@auraelixir.co.in</p>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong className="font-semibold text-slate-900 dark:text-white">Phone:</strong> +91 9028709575</p>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong className="font-semibold text-slate-900 dark:text-white">Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Shipping Policy
            </h2>
            <p className="text-slate-700 dark:text-gray-200">
              At Aura Elixir, we are committed to delivering your luxury fragrances safely and promptly. This shipping policy outlines our delivery procedures, timelines, and nationwide coverage. We understand that every order is precious, whether it's a thoughtful gift for yourself or your loved ones.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Your Order, Our Priority
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              We recognize that every purchase from Aura Elixir represents a meaningful choice. To ensure the safety and timely delivery of your fragrance order, we partner with India's leading courier companies that specialize in:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Secure and safe packaging of delicate fragrance products</li>
              <li>Reliable and efficient delivery across India</li>
              <li>Real-time tracking and updates</li>
              <li>Professional handling of luxury items</li>
              <li>Timely delivery with minimal disruptions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Delivery Timeline
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Order Processing & Dispatch</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li><strong>Processing Time:</strong> Orders are carefully prepared and dispatched within 1-2 business days of order confirmation</li>
              <li><strong>Business Days:</strong> Processing excludes weekends and national holidays</li>
              <li><strong>Dispatch Notification:</strong> You will receive an email with tracking information once your order is dispatched</li>
              <li><strong>Tracking Details:</strong> Tracking link and courier partner information will be provided</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Delivery Duration</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li><strong>Standard Delivery:</strong> 3-6 business days from dispatch</li>
              <li><strong>Delivery Timeline:</strong> Typically 5-8 business days from order placement (processing + transit)</li>
              <li><strong>Excludes:</strong> Weekends, national holidays, and unforeseen delays</li>
              <li><strong>Estimates:</strong> These are estimates based on normal conditions; actual delivery may vary</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Important Notes on Delivery</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Delivery times are subject to courier partner performance and external factors</li>
              <li>Peak seasons (festivals, holidays) may result in extended delivery times</li>
              <li>Weather, traffic, or other force majeure events may cause delays</li>
              <li>We will keep you updated on your order status throughout the shipping process</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Nationwide Coverage
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              We are proud to offer shipping across all locations throughout India. Our commitment to nationwide coverage ensures that our premium fragrances are accessible to customers wherever they are located.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Service Areas</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Metro cities (Delhi, Mumbai, Bangalore, Hyderabad, Kolkata, Chennai, etc.)</li>
              <li>Tier 1 and Tier 2 cities across India</li>
              <li>Remote and rural areas through trusted logistics partners</li>
              <li>All pin codes in India (subject to courier partner service availability)</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Logistics Partners</h3>
            <p className="text-slate-700 dark:text-gray-200">
              We work with India's most reliable and respected courier companies, including major providers like Shiprocket partners and premium logistics services. These partners are selected based on their reliability, track record, and ability to handle delicate luxury products securely.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Order Tracking
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Tracking Information</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Once your order is dispatched, you will receive an email with a tracking link</li>
              <li>Use the tracking number to monitor your package in real-time</li>
              <li>Tracking updates are available on the courier partner's website/app</li>
              <li>Check your email (including spam/promotions folder) for dispatch notifications</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Tracking During Delivery</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li><strong>Real-time Updates:</strong> Track your package status at every stage</li>
              <li><strong>Delivery Notifications:</strong> Receive SMS/Email when package is out for delivery</li>
              <li><strong>Proof of Delivery:</strong> Delivery confirmation with date and time</li>
              <li><strong>Driver Contact:</strong> Some couriers provide driver contact details on delivery day</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Delayed Deliveries
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">What Counts as a Delayed Delivery</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              If your order has not arrived by the expected delivery date mentioned in your tracking information, it may be considered delayed. Common reasons for delays include:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Weather conditions or natural disasters</li>
              <li>Traffic or transportation issues</li>
              <li>Peak season delivery overload</li>
              <li>Address-related complications</li>
              <li>Courier partner operational issues</li>
              <li>Force majeure events</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">How to Report a Delayed Delivery</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              If your order has not arrived by the expected delivery date, please contact us immediately:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li><strong>Email:</strong> help@auraelixir.co.in</li>
              <li><strong>Phone:</strong> +91 9028709575</li>
              <li><strong>Provide:</strong> Your order number and tracking number</li>
              <li><strong>Expected Delivery Date:</strong> As shown in your tracking information</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Investigation Process</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Upon receiving your delayed delivery report, we will initiate an investigation with our logistics partner</li>
              <li>Investigation typically includes package location tracking and carrier verification</li>
              <li><strong>Investigation Duration:</strong> Up to 2 weeks to locate and resolve the issue</li>
              <li>We will keep you updated on the investigation status via email/phone</li>
              <li>Once located, the package will be prioritized for immediate delivery</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Resolution Options</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              Depending on the investigation outcome, we may offer:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Locating and rerouting your package for expedited delivery</li>
              <li>Replacement order shipment at no additional cost</li>
              <li>Full refund if package is deemed lost by courier partner</li>
              <li>Partial compensation for the inconvenience caused</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Delivery Safety & Packaging
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Secure Packaging</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>All fragrance products are carefully packaged to ensure safety during transit</li>
              <li>Bubble wrap and protective materials prevent bottle damage</li>
              <li>Boxes are sealed securely to prevent tampering</li>
              <li>Fragile item stickers placed for special handling</li>
              <li>Discreet packaging available upon request</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Temperature Control</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Fragrances are sensitive to extreme temperatures</li>
              <li>Our logistics partners use temperature-controlled storage and vehicles</li>
              <li>Special care is taken during peak summer months</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Handling Instructions</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Courier partners are instructed to handle packages with care</li>
              <li>"Fragile" and "This Side Up" labels are prominently displayed</li>
              <li>Delivery personnel are trained for luxury product handling</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Delivery Instructions & Special Requests
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Address Accuracy</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Ensure your delivery address is complete and accurate during checkout</li>
              <li>Include building name, landmark, or detailed directions if available</li>
              <li>Provide a valid phone number for delivery contact</li>
              <li>Update address information before order dispatch if needed</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Delivery Preferences</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Discreet packaging available for privacy</li>
              <li>Leave at doorstep option (at customer's risk)</li>
              <li>Sign on delivery requirement</li>
              <li>Contact us for special delivery instructions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Issues at Delivery
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Damaged Delivery</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>If package arrives damaged, refuse delivery if possible</li>
              <li>Take photos of damage with timestamp</li>
              <li>Contact us within 2 hours of delivery with damage proof</li>
              <li>We will arrange replacement or refund immediately</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Wrong Delivery / Wrong Item</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>If wrong item delivered, contact us immediately with photo proof</li>
              <li>Provide your order number and tracking number</li>
              <li>We will arrange corrected delivery or refund within 24 hours</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Unclaimed / Refused Delivery</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>If you refuse delivery, the package will be returned to us</li>
              <li>Return shipping costs may be deducted from refunds</li>
              <li>Contact us before refusing delivery whenever possible</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Shipping to Different Locations
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Residential Addresses</h3>
            <p className="text-slate-700 dark:text-gray-200">
              Delivery to home addresses follows standard timelines (3-6 business days). Ensure someone is available to receive the package, as fragile items require signature confirmation.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Commercial Addresses</h3>
            <p className="text-slate-700 dark:text-gray-200">
              Deliveries to office addresses typically arrive during business hours. Please provide office phone number and building access details for smooth delivery.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Remote/Rural Areas</h3>
            <p className="text-slate-700 dark:text-gray-200">
              Deliveries to remote locations may take 7-10 business days depending on courier service availability. We will confirm feasibility and timeline during checkout.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Shipping During Special Periods
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Festival Seasons & Peak Periods</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>During Diwali, Valentine's Day, and other peak seasons, delivery times may extend by 2-3 days</li>
              <li>We recommend ordering well in advance during these periods</li>
              <li>Express shipping options may be available (check at checkout)</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">National Holidays & Weekends</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Orders placed on weekends/holidays are processed from the next business day</li>
              <li>Delivery timelines do not include weekends or national holidays</li>
              <li>Processing during national holidays may be delayed</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Weather Conditions</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Monsoon season may cause delivery delays due to weather conditions</li>
              <li>Summer heat requires special temperature control measures</li>
              <li>Winter conditions may affect remote area deliveries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              International Shipping (Future)
            </h2>
            <p className="text-slate-700 dark:text-gray-200">
              Currently, we only ship within India. International shipping options may be available in the future. Please check back for updates or contact us for inquiries about overseas orders.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Contact & Support
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              For any questions, concerns, or special shipping requests, our customer support team is ready to help:
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-amber-50 dark:from-purple-900/30 dark:to-amber-900/30 border-l-4 border-purple-600 p-4 rounded-lg">
              <p className="mb-2 text-slate-700 dark:text-gray-200"><strong>Email:</strong> help@auraelixir.co.in</p>
              <p className="mb-2 text-slate-700 dark:text-gray-200"><strong>Phone:</strong> +91 9028709575</p>
              <p className="mb-2 text-slate-700 dark:text-gray-200"><strong>Hours:</strong> Monday - Friday, 11:00 AM - 6:00 PM (IST)</p>
              <p className="text-slate-700 dark:text-gray-200"><strong>Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Important Notes</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-gray-200">
                <li><strong>Timelines are Estimates:</strong> Delivery dates provided are estimates and not guaranteed. Actual delivery may vary based on circumstances beyond our control.</li>
                <li><strong>Track Your Order:</strong> Always track your order using the provided tracking number to stay updated.</li>
                <li><strong>Recipient Availability:</strong> Please ensure someone is available to receive the package as fragrance delivery requires signature confirmation.</li>
                <li><strong>Address Verification:</strong> Double-check your delivery address before placing an order. Changes after dispatch may not be possible.</li>
                <li><strong>Policy Updates:</strong> This Shipping Policy may be updated at any time. Customers will be notified of changes via email.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
