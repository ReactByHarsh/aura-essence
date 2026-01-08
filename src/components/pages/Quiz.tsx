"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles, RefreshCcw, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

// Real Product Data Mapping
const PRODUCTS = {
    sauvage: {
        id: "101ff593-10bf-4c71-90c9-ffeec398f2ab",
        name: "Sauvage",
        brand: "Inspired",
        price: 1199.00,
        images: ["https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/sauvage100.png"],
        category: "men",
        description: "Inspired by wild fresh fragrances",
        sizes: {
            "20ml": { "label": "20 ml", "price": 299 },
            "30ml": { "label": "30 ml", "price": 369 },
            "50ml": { "label": "50 ml", "price": 499 },
            "100ml": { "label": "100 ml", "price": 699 }
        }
    },
    tobaccoOud: {
        id: "bd184663-62f4-4d5e-8e21-a4078d030785",
        name: "Tobacco Oud",
        brand: "Inspired",
        price: 1999.00,
        images: ["https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/tobbacco.png"],
        category: "unisex",
        description: "Inspired by Tom Ford Tobacco Oud – dark, smoky, luxurious.",
        sizes: {
            "20ml": { "label": "20 ml", "price": 299 },
            "30ml": { "label": "30 ml", "price": 369 },
            "50ml": { "label": "50 ml", "price": 499 },
            "100ml": { "label": "100 ml", "price": 699 }
        }
    },
    rose: {
        id: "15c9f7ef-c327-4abf-89fe-37f284d2643a",
        name: "Rose",
        brand: "Inspired",
        price: 1399.00,
        images: ["https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/rose.png"],
        category: "women",
        description: "Inspired by Louis Vuitton Rose des Vents – airy floral rose.",
        sizes: {
            "20ml": { "label": "20 ml", "price": 299 },
            "30ml": { "label": "30 ml", "price": 369 },
            "50ml": { "label": "50 ml", "price": 499 },
            "100ml": { "label": "100 ml", "price": 699 }
        }
    },
    scarlett: {
        id: "c8d50c90-798f-4d86-b802-67d0f1c6103a",
        name: "Scarlett",
        brand: "Inspired",
        price: 1399.00,
        images: ["https://wnaxppdlvfcfeluxlvxn.supabase.co/storage/v1/object/public/product-images/scarlette.png"],
        category: "women",
        description: "Inspired by Burberry Her – sweet fruity floral signature.",
        sizes: {
            "20ml": { "label": "20 ml", "price": 299 },
            "30ml": { "label": "30 ml", "price": 369 },
            "50ml": { "label": "50 ml", "price": 499 },
            "100ml": { "label": "100 ml", "price": 699 }
        }
    }
};

// Quiz Questions Data
const questions = [
    {
        id: 1,
        question: "What's the occasion?",
        options: [
            { id: 'daily', label: 'Daily Wear', icon: '☀️' },
            { id: 'night', label: 'Date Night', icon: '🌙' },
            { id: 'office', label: 'Office / Work', icon: '💼' },
            { id: 'party', label: 'Party / Event', icon: '🎉' },
        ]
    },
    {
        id: 2,
        question: "How do you want to feel?",
        options: [
            { id: 'fresh', label: 'Fresh & Clean', icon: '🍃' },
            { id: 'bold', label: 'Bold & Confident', icon: '🦁' },
            { id: 'elegant', label: 'Elegant & Sophisticated', icon: '🍸' },
            { id: 'warm', label: 'Cozy & Warm', icon: '🔥' },
        ]
    },
    {
        id: 3,
        question: "Pick a note you love:",
        options: [
            { id: 'citrus', label: 'Citrus (Lemon, Bergamot)', icon: '🍋' },
            { id: 'floral', label: 'Floral (Rose, Jasmine)', icon: '🌸' },
            { id: 'wood', label: 'Woody (Oud, Sandalwood)', icon: '🌲' },
            { id: 'spice', label: 'Spicy (Vanilla, Saffron)', icon: '🧂' },
        ]
    }
];

// Result Logic Mapping
const recommendations: Record<string, any> = {
    'fresh': {
        product: PRODUCTS.sauvage,
        tag: 'Best Seller'
    },
    'bold': {
        product: PRODUCTS.tobaccoOud,
        tag: 'Premium'
    },
    'elegant': {
        product: PRODUCTS.rose,
        tag: 'Luxury'
    },
    'warm': {
        product: PRODUCTS.scarlett,
        tag: 'New Arrival'
    }
};

export function Quiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const addItem = useCartStore((state) => state.addItem);
    const router = useRouter();
    const openCart = useCartStore((state) => state.openCart); // Assuming openCart exists or we just rely on drawer

    const handleOptionSelect = (optionId: string) => {
        setAnswers({ ...answers, [currentStep]: optionId });

        if (currentStep < questions.length - 1) {
            setTimeout(() => setCurrentStep(c => c + 1), 300);
        } else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setShowResult(true);
            }, 1500);
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setShowResult(false);
    };

    const handleAddToCart = async () => {
        if (!recommendation?.product) return;

        setAddingToCart(true);
        try {
            // Add 30ml size as requested
            await addItem(recommendation.product as unknown as Product, 1, '30ml');

            // Open cart logic (optional, if supported by store) or route to cart? 
            // Usually addItem triggers cart open or we can trigger it.
            // Let's assume the cart drawer handles itself or we just show success.
            // Since we can't trigger the drawer directly from here without that action exposed, 
            // we will simulate a short delay and then show a success state or just finish.
            // If `openCart` is available in store we call it.

            // For now, success creates a visual feedback.
        } catch (error) {
            console.error("Failed to add to cart", error);
        } finally {
            setAddingToCart(false);
        }
    };

    // Determine result based on "feeling" answer (index 1)
    const resultKey = answers[1] || 'fresh';
    const recommendation = recommendations[resultKey] || recommendations['fresh'];
    const product = recommendation.product;

    return (
        <div className="min-h-screen bg-primary-950 text-neutral-50 flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col">
                <main className="flex-1 flex items-center justify-center p-4">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                <h2 className="text-2xl font-serif font-bold mb-2">Analyzing your aura...</h2>
                                <p className="text-neutral-400">Curating your perfect scent profile</p>
                            </motion.div>
                        ) : showResult ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-primary-900/40 p-6 md:p-12 rounded-2xl border border-primary-800 backdrop-blur-sm"
                            >
                                <div className="relative aspect-square md:aspect-[4/5] w-full rounded-xl overflow-hidden shadow-2xl border-2 border-primary-800/50">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-accent-500 text-primary-950 text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                        {recommendation.tag}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="w-5 h-5 text-accent-400" />
                                        <span className="text-accent-400 text-sm font-bold tracking-widest uppercase">Perfect Match Found</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{product.name}</h1>
                                    <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            size="lg"
                                            onClick={handleAddToCart}
                                            disabled={addingToCart}
                                            className="bg-accent-600 hover:bg-accent-500 text-primary-950 font-bold h-14 px-8 text-base shadow-lg hover:shadow-accent-500/20"
                                        >
                                            {addingToCart ? (
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            ) : (
                                                <ShoppingBag className="w-5 h-5 mr-2" />
                                            )}
                                            Add to Cart (30ml) - ₹369
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={resetQuiz}
                                            className="border-primary-700 hover:bg-primary-800 text-neutral-300 h-14 px-8"
                                        >
                                            Retake Quiz <RefreshCcw className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-2xl w-full"
                            >
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-center mb-12">
                                    {questions[currentStep].question}
                                </h1>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {questions[currentStep].options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionSelect(option.id)}
                                            className={`
                        group relative p-6 rounded-xl border transition-all duration-300
                        ${answers[currentStep] === option.id
                                                    ? 'bg-accent-600 border-accent-500 text-primary-950'
                                                    : 'bg-primary-900/50 border-primary-800 hover:border-accent-500/50 hover:bg-primary-800'}
                      `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">{option.icon}</span>
                                                <span className={`font-medium text-lg ${answers[currentStep] === option.id ? 'text-primary-950' : 'text-neutral-200'}`}>
                                                    {option.label}
                                                </span>
                                            </div>

                                            {answers[currentStep] === option.id && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    <Check className="w-5 h-5 text-primary-950" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
