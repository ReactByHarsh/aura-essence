"use client";
import React from 'react';

export function RefundPolicy() {
  return (
    <div className="min-h-screen">
      {/* Premium Hero Section - Mobile Optimized */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="mb-4 sm:mb-6 inline-block">
            <span className="text-amber-400 text-xs sm:text-sm font-semibold tracking-widest">POLICIES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white mb-3 sm:mb-4 leading-tight">
            Refund Policy
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        <div className="prose prose-lg max-w-none text-slate-600 dark:text-gray-300">
          <p className="text-sm text-slate-600 dark:text-gray-400 mb-8">
            Last updated: January 25, 2025
          </p>

          {/* Business Information Box */}
          <div className="bg-gradient-to-r from-purple-50 to-amber-50 dark:from-purple-900/30 dark:to-amber-900/30 border-l-4 border-purple-600 p-4 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Business Information</h3>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Business Name:</strong> Aura Elixir</p>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Managed by:</strong> Harshavardhan Shinde</p>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Email:</strong> help@auraelixir.co.in</p>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Phone:</strong> +91 9028709575</p>
            <p className="text-sm text-slate-700 dark:text-gray-200"><strong>Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Refund Policy
            </h2>
            <p className="text-slate-700 dark:text-gray-200">
              At Aura Elixir, we are committed to customer satisfaction. This refund policy outlines the terms and conditions for returns, refunds, and cancellations in accordance with Indian consumer protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Return Policy
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              We understand that purchasing fragrances online can be challenging. To ensure customer satisfaction, we offer the following return options:
            </p>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Product Categories</h3>
            <ul className="list-disc list-inside space-y-3 mb-6 text-slate-700 dark:text-gray-200">
              <li><strong>Unopened Products:</strong> Full refunds accepted within 2 days of delivery for unopened, original packaging products</li>
              <li><strong>Trial/Decant Sizes (20ml):</strong> Strictly non-returnable, non-refundable, and non-exchangeable. We recommend decants to test products before purchasing full-size bottles</li>
              <li><strong>Opened or Used Fragrances:</strong> Returns and exchanges are not offered for opened, tested, or used fragrances for health and safety reasons</li>
              <li><strong>Damaged/Defective Products:</strong> Returns accepted for damaged or defective products with proof (unboxing video). Contact us within 2 business days of delivery. When approved, replacement will be provided in 7 days</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Return Process</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              To initiate a return, please contact us with the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Customer Name and Email Address</li>
              <li>Order Number</li>
              <li>Reason for Return</li>
              <li>Proof of damage/defect (unboxing video if applicable)</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Return Eligibility</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              Returns must meet the following criteria:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Requested within 2 days of delivery</li>
              <li>Product is unopened and in original packaging (except for damaged/defective items)</li>
              <li>Accompanied by a valid RMA number (Request for Return Authorization)</li>
              <li>Shipped back to our address at customer's expense</li>
              <li>Product received in resalable condition</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Damaged/Defective Products</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              If your order arrives damaged or defective:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Contact us within 2 business days with mandatory unboxing video</li>
              <li>Email: help@auraelixir.co.in or call +91 9028709575 (Monday-Friday, 11 AM - 6 PM)</li>
              <li>We will arrange for replacement or refund at our discretion</li>
              <li>When damaged product is approved, replacement will be provided in 7 days</li>
              <li>Original shipping costs are non-refundable for damaged items; replacement shipping is on us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Shipping Costs
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              Shipping costs are non-refundable for:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Returned, undelivered, unclaimed, or refused packages</li>
              <li>Any shipping costs incurred by you to return products to us</li>
              <li>Initial shipping charges for returned items</li>
            </ul>

            <p className="mb-4 text-slate-700 dark:text-gray-200">
              <strong>Exception:</strong> In case of shipping errors made by us (wrong address provided to carrier, etc.), we will cover the cost of replacement shipment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Refund Processing
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Refund Approval</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Refunds are processed only upon approval after we receive and inspect the returned product</li>
              <li>We verify that the product meets return criteria before approving refunds</li>
              <li>Refund status will be communicated via email</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Refund Timeline</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Processing time: 7-10 business days from product receipt and verification</li>
              <li>Bank processing time: Additional 2-3 business days for the refund to appear in your account</li>
              <li>Total refund timeline: 10-15 business days from product receipt</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Refund Method</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Refunds are issued to the original payment method used for purchase</li>
              <li>For cash-on-delivery (COD) orders, bank details must be provided</li>
              <li>Processing may take an additional 2-3 business days depending on your bank</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Refund Deduction</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              A 2.5% payment gateway processing fee is deducted from all refunds. This fee covers the cost of payment processing and transaction reversal. For example, on a ₹1,000 order, you would receive ₹975 after the deduction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Failed Transactions
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              If your payment fails or is declined:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Refunds for failed online transactions are automatically processed to the original payment source</li>
              <li>Processing time: Up to 7 working days</li>
              <li>We do not hold any amounts; processing depends on your bank and payment gateway</li>
              <li>Check your bank account or credit card statement to confirm the refund</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Replacement Policy
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              For damaged or defective products, we offer replacements as an alternative to refunds:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Replacement is available within 2 days of delivery with proof (unboxing video)</li>
              <li>We ship the replacement product at our expense</li>
              <li>Original product must be returned to us for inspection</li>
              <li>Replacement timeline: 3-5 business days after return approval</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Cancellation Policy
            </h2>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Company-Initiated Cancellations</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              We reserve the right to cancel orders at our discretion. Common reasons for cancellations include:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li>Product out of stock or unavailable</li>
              <li>Pricing or product information errors</li>
              <li>Quality defects identified during fulfillment</li>
              <li>Additional verification or compliance requirements</li>
              <li>Fraudulent or suspicious activity</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-3">Customer-Initiated Cancellations</h3>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              Orders can be canceled by customers under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li><strong>Timing:</strong> Orders can be canceled within 1 hour of placement only</li>
              <li><strong>After 1 hour:</strong> Order enters fulfillment stage and cannot be canceled</li>
              <li><strong>How to Cancel:</strong> Email order ID, customer name, and cancellation reason to help@auraelixir.co.in</li>
              <li><strong>Refund:</strong> Full refund (minus 2.5% processing fee) will be issued to original payment method</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Important Notes
            </h2>
            <ul className="list-disc list-inside space-y-3 mb-6 text-slate-700 dark:text-gray-200">
              <li><strong>No Return Without RMA:</strong> Returns without a valid RMA number may be returned to you or destroyed at our discretion</li>
              <li><strong>Unboxing Video Required:</strong> Mandatory for all damage/defect claims. Video must show sealed package opening</li>
              <li><strong>Product Condition:</strong> Returned items must be in resalable condition with original packaging intact</li>
              <li><strong>Health & Safety:</strong> No returns accepted for opened, tested, or used fragrances for health and safety compliance</li>
              <li><strong>Sample Size Products:</strong> Decants and samples are final sale products - no returns or exchanges</li>
              <li><strong>Age Verification:</strong> Orders may be canceled if age verification cannot be completed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Indian Consumer Protection Act Compliance
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              This Refund Policy complies with:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 dark:text-gray-200">
              <li><strong>Consumer Protection Act, 2019:</strong> All consumer rights regarding returns, refunds, and complaints</li>
              <li><strong>E-commerce Rules, 2020:</strong> Mandatory return window and cancellation policies</li>
              <li><strong>Goods and Services Tax Act, 2017:</strong> GST treatment of refunds and returns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Contact & Support
            </h2>
            <p className="mb-4 text-slate-700 dark:text-gray-200">
              For any questions regarding refunds, returns, or cancellations, please contact us:
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Important Disclaimer</h3>
              <p className="text-sm text-slate-700 dark:text-gray-200 mb-2">
                <strong>Product Safety:</strong> All refunds and exchanges are subject to the condition that the product has not been opened, used, or tested. For health and safety reasons, we cannot accept returns of used fragrances.
              </p>
              <p className="text-sm text-slate-700 dark:text-gray-200 mb-2">
                <strong>Age Verification:</strong> Orders for our 18+ products require age verification. Failure to verify age may result in order cancellation without refund.
              </p>
              <p className="text-sm text-slate-700 dark:text-gray-200">
                <strong>Policy Changes:</strong> We reserve the right to update this Refund Policy at any time. Customers will be notified of material changes via email.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
