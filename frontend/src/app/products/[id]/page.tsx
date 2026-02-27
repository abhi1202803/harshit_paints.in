"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Star, Shield, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Brand = {
    id: string;
    brand_name: string;
};

type Quantity = {
    id: string;
    quantity: string;
    base_price: number;
    stock: number;
};

type Product = {
    id: string;
    name: string;
    description: string;
    images: string[];
    gst_percentage: number;
    brand: Brand;
    quantities: Quantity[];
};

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedQty, setSelectedQty] = useState<Quantity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                if (data.quantities?.length > 0) {
                    // Select cheapest quantity by default
                    const sorted = [...data.quantities].sort((a, b) => a.base_price - b.base_price);
                    setSelectedQty(sorted[0]);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (!product || !selectedQty || selectedQty.stock <= 0) return;
        setIsAdding(true);

        addToCart({
            id: selectedQty.id,
            product_id: product.id,
            name: product.name,
            brand: product.brand.brand_name,
            qtyName: selectedQty.quantity,
            price: selectedQty.base_price,
            count: 1,
            gst: product.gst_percentage,
            image: product.images?.[0] || null,
            stock: selectedQty.stock
        });

        setTimeout(() => {
            setIsAdding(false);
            setAdded(true);
            setTimeout(() => setAdded(false), 3000);
        }, 300);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-dark-950">
                <AlertCircle size={64} className="text-red-500 mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h1>
                <p className="text-gray-500 mb-8">The paint or product you are looking for does not exist or has been removed.</p>
                <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                    Back to Shop
                </Link>
            </div>
        );
    }

    // Calculate prices
    const basePrice = selectedQty?.base_price || 0;
    const gstAmount = basePrice * (product.gst_percentage / 100);
    const finalPrice = basePrice + gstAmount;

    return (
        <div className="bg-gray-50 dark:bg-dark-950 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <Link href="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Products
                </Link>

                <div className="bg-white dark:bg-dark-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

                        {/* Left: Image Carousel (Simplified) */}
                        <div className="relative p-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center min-h-[400px]">
                            {product.images?.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="max-w-full max-h-[500px] object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="text-gray-400 text-xl font-medium">No Image Available</div>
                            )}

                            <div className="absolute top-6 left-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                                    {product.brand.brand_name}
                                </span>
                            </div>
                        </div>

                        {/* Right: Product Interface */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">

                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                </div>
                                <span className="text-sm font-medium text-gray-500">(4.8/5 Premium Rating)</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                {product.name}
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Quantity Selector */}
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Select Size/Quantity</h3>
                                <div className="flex flex-wrap gap-4">
                                    {product.quantities.map((q) => (
                                        <button
                                            key={q.id}
                                            onClick={() => setSelectedQty(q)}
                                            className={`px-6 py-3 rounded-xl border-2 font-semibold text-lg transition-all ${selectedQty?.id === q.id
                                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm"
                                                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500"
                                                } ${q.stock <= 0 ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800" : ""}`}
                                            disabled={q.stock <= 0}
                                        >
                                            {q.quantity}
                                            {q.stock <= 0 && <span className="block text-xs font-normal text-red-500 mt-1">Out of Stock</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-8" />

                            {/* Pricing & Add to Cart */}
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        Base: ₹{basePrice.toLocaleString()} + GST ({product.gst_percentage}%): ₹{Math.round(gstAmount).toLocaleString()}
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 dark:text-white flex items-baseline gap-2">
                                        ₹{Math.round(finalPrice).toLocaleString()}
                                        <span className="text-lg font-medium text-gray-500">incl. taxes</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedQty || selectedQty.stock <= 0 || isAdding || added}
                                    className={`px-8 py-4 rounded-full font-bold text-lg text-white flex items-center justify-center gap-2 min-w-[200px] transition-all transform hover:scale-105 active:scale-95 shadow-lg ${added
                                        ? "bg-green-500 shadow-green-500/30"
                                        : !selectedQty || selectedQty.stock <= 0
                                            ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed shadow-none hover:scale-100"
                                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/40"
                                        }`}
                                >
                                    {isAdding ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : added ? (
                                        <>
                                            <Check size={24} /> Added
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={24} /> Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex items-center gap-6 mt-6">
                                <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-500">
                                    <Shield size={18} />
                                    100% Authentic Product
                                </div>
                                <div className="flex gap-2">
                                    <span className={`block w-2.5 h-2.5 rounded-full ${selectedQty?.stock && selectedQty.stock > 0 ? "bg-green-500" : "bg-red-500"} mt-1`} />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {selectedQty?.stock && selectedQty.stock > 0 ? `In Stock (${selectedQty.stock} left)` : "Out of Stock"}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
