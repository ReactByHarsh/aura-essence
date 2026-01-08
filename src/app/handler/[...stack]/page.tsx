"use client";
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { StackHandler } from "@stackframe/stack";

export default function Handler() {
  const pathname = usePathname();
  const isSignUp = pathname?.includes('sign-up');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 bg-primary-950 text-neutral-50">
      <div className="mb-8 text-center text-white">
        <h1 className="text-2xl font-serif font-bold mb-2">
          {isSignUp ? 'Create a new account' : 'Sign in to your account'}
        </h1>
        <p className="text-neutral-400 text-sm">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span className="text-accent-500 font-bold">
            {isSignUp ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg p-1">
        <StackHandler fullPage />
      </div>
    </div>
  );
}
