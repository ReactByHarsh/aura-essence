"use client";
import React from 'react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-primary-950 text-neutral-200">
      {/* Premium Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-primary-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/60 via-primary-950 to-primary-950"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="h-[1px] w-12 bg-accent-500"></div>
            <span className="text-accent-500 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">LEGAL</span>
            <div className="h-[1px] w-12 bg-accent-500"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-50 mb-8 leading-tight font-serif">
            Privacy Policy
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose prose-lg max-w-none prose-invert text-neutral-400">
          <p className="text-sm text-accent-500 mb-8 font-medium">
            Last updated: January 25, 2025
          </p>

          {/* Business Information Box */}
          <div className="bg-primary-900/30 border-l-2 border-accent-500 p-8 mb-12">
            <h3 className="text-lg font-bold text-neutral-50 mb-4 font-serif">Business Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-300">
              <p><strong className="text-accent-500 font-medium">Business Name:</strong> Aura Elixir</p>
              <p><strong className="text-accent-500 font-medium">Managed by:</strong> Harshavardhan Shinde</p>
              <p><strong className="text-accent-500 font-medium">Email:</strong> help@auraelixir.co.in</p>
              <p><strong className="text-accent-500 font-medium">Phone:</strong> +91 9028709575</p>
              <p className="sm:col-span-2"><strong className="text-accent-500 font-medium">Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">
              Privacy Policy
            </h2>
            <p className="mb-4 text-neutral-400 leading-relaxed font-light">
              This Privacy Policy describes how Aura Elixir (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from auraelixir.co.in (the "Site") or otherwise communicate with us regarding the Site (collectively, the "Services"). For purposes of this Privacy Policy, "you" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.
            </p>
            <p className="text-neutral-400 leading-relaxed font-light">
              Please read this Privacy Policy carefully. By using and accessing any of the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not use or access any of the Services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">
              Changes to This Privacy Policy
            </h2>
            <p className="text-neutral-400 leading-relaxed font-light">
              We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the "Last updated" date and take any other steps required by applicable law.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">
              How We Collect and Use Your Personal Information
            </h2>
            <p className="mb-4 text-neutral-400 leading-relaxed font-light">
              To provide the Services, we collect personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.
            </p>
            <p className="text-neutral-400 leading-relaxed font-light">
              In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide or improve the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">
              What Personal Information We Collect
            </h2>
            <p className="mb-4 text-neutral-400 leading-relaxed font-light">
              The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term "personal information", we are referring to information that identifies, relates to, describes or can be associated with you.
            </p>

            <h3 className="text-lg font-bold text-neutral-200 mb-3 font-serif">Information We Collect Directly from You</h3>
            <p className="mb-3 text-neutral-400 leading-relaxed font-light">
              Information that you directly submit to us through our Services may include:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-neutral-400 ml-4 font-light">
              <li>Contact details including your name, address, phone number, and email</li>
              <li>Order information including your name, billing address, shipping address, payment confirmation, email address, and phone number</li>
              <li>Account information including your username, password, security questions and other information used for account security purposes</li>
              <li>Customer support information including the information you choose to include in communications with us, for example, when sending a message through the Services</li>
            </ul>
            <p className="text-neutral-400 leading-relaxed font-light">
              Some features of the Services may require you to directly provide us with certain information about yourself. You may elect not to provide this information, but doing so may prevent you from using or accessing these features.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-50 mb-4 font-serif">Contact</h2>
            <p className="mb-4 text-neutral-400 font-light">Should you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of the rights available to you, please contact us:</p>
            <div className="bg-primary-900/50 border border-primary-800 p-6">
              <p className="text-neutral-300 mb-2"><strong className="text-accent-500">Email:</strong> help@auraelixir.co.in</p>
              <p className="text-neutral-300 mb-2"><strong className="text-accent-500">Phone:</strong> +91 9028709575</p>
              <p className="text-neutral-300"><strong className="text-accent-500">Address:</strong> Balaji Colony, Barshi - 413401, Maharashtra, India</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}