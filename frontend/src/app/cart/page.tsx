"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, ShieldCheck, CreditCard, Tag, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items: cartItems, removeFromCart, updateQuantity, subtotal, gstTotal, discountAmount, appliedCoupon, applyCoupon, removeCoupon, total, clearCart } = useCart();
    const { user, token } = useAuth();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Coupon State
    const [couponInput, setCouponInput] = useState("");
    const [couponMessage, setCouponMessage] = useState({ text: "", type: "" });

    const handleCheckout = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        setIsCheckingOut(true);
        try {
            const res = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: cartItems.map((item) => ({
                        product_id: item.product_id,
                        qty_id: item.id,
                        count: item.count,
                    })),
                    coupon_code: appliedCoupon // Pass the applied coupon to the backend
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create order");
            }

            clearCart();
            alert("Order placed successfully! Check your email for the invoice.");
            router.push('/products');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleApplyCoupon = () => {
        if (!couponInput.trim()) return;
        const result = applyCoupon(couponInput);
        setCouponMessage({
            text: result.message,
            type: result.success ? "success" : "error"
        });
        if (result.success) setCouponInput("");

        // Auto hide success message
        if (result.success) {
            setTimeout(() => setCouponMessage({ text: "", type: "" }), 3000);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponMessage({ text: "", type: "" });
    };

    const removeCartItem = (id: string) => removeFromCart(id);
    const updateCount = (id: string, count: number) => updateQuantity(id, count);

    return (
        <div className="bg-gray-50 dark:bg-dark-950 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-4 mb-8">
                    <Link href="/products" className="text-gray-500 hover:text-blue-600 transition-colors bg-white dark:bg-dark-900 p-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Shopping Cart</h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <div className="bg-gray-100 dark:bg-gray-800 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🛒</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is completely empty</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any premium paints to your cart yet. Discover our collections right away!</p>
                        <Link href="/products" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6 items-center shadow-sm relative group hover:shadow-md transition-shadow">

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeCartItem(item.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 dark:bg-gray-800 rounded-full sm:opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="h-28 w-28 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0 object-contain p-2">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                        ) : (
                                            <span className="text-gray-400 font-medium text-xs text-center">{item.brand}</span>
                                        )}
                                    </div>

                                    <div className="flex-grow text-center sm:text-left">
                                        <div className="text-xs font-bold text-blue-600 mb-1">{item.brand}</div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">{item.name}</h3>
                                        <div className="text-sm text-gray-500 mb-4">Size Selected: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.qtyName}</span></div>

                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            {/* Quantity Toggles */}
                                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                                <button onClick={() => updateCount(item.id, item.count - 1)} className="w-8 h-8 rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:text-blue-600 transition-colors">-</button>
                                                <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{item.count}</span>
                                                <button onClick={() => updateCount(item.id, item.count + 1)} className="w-8 h-8 rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:text-blue-600 transition-colors">+</button>
                                            </div>

                                            <div className="text-lg font-black text-gray-900 dark:text-white">
                                                ₹{(item.price * item.count).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary & Checkout */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-dark-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-900/5 sticky top-28">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                                {/* Coupon Section */}
                                <div className="mb-6">
                                    {!appliedCoupon ? (
                                        <div className="flex gap-2 relative">
                                            <div className="relative flex-grow">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Tag size={16} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Coupon Code"
                                                    value={couponInput}
                                                    onChange={(e) => setCouponInput(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={!couponInput.trim()}
                                                className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Tag size={18} className="text-green-600 dark:text-green-500" />
                                                <div>
                                                    <span className="block text-sm font-bold text-green-800 dark:text-green-400 uppercase">{appliedCoupon}</span>
                                                    <span className="block text-xs text-green-600 dark:text-green-500 font-medium whitespace-nowrap">15% Discount Applied</span>
                                                </div>
                                            </div>
                                            <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800 dark:text-green-400 p-1">
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    )}
                                    {couponMessage.text && !appliedCoupon && (
                                        <p className={`mt-2 text-xs font-medium ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                            {couponMessage.text}
                                        </p>
                                    )}
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

                                <div className="space-y-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Products Subtotal</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                                            <span>Coupon Discount (15%)</span>
                                            <span>-₹{Math.round(discountAmount).toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Estimated GST (18%)</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">₹{Math.round(gstTotal).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-6" />

                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-gray-500 font-medium">Total Amount</span>
                                    <div className="text-right">
                                        <span className="block text-3xl font-black text-gray-900 dark:text-white leading-none">
                                            ₹{Math.round(total).toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-400">Including all taxes</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut || cartItems.length === 0}
                                    className={`w-full text-white py-4 rounded-xl font-bold text-lg transition flex justify-center items-center gap-2 mb-4 shadow-lg group ${isCheckingOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
                                >
                                    {isCheckingOut ? "Processing..." : "Proceed To Checkout"}
                                    {!isCheckingOut && <ArrowLeft className="group-hover:-translate-x-1 transition-transform rotate-180" size={20} />}
                                </button>

                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
                                    <ShieldCheck size={16} className="text-green-500" /> Secure encrypted checkout
                                    <CreditCard size={16} className="ml-2 text-gray-400" />
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
