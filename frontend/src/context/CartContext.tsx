"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
    id: string; // product qty id
    product_id: string;
    name: string;
    brand: string;
    qtyName: string;
    price: number;
    count: number;
    gst: number;
    image: string | null;
    stock: number;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, count: number) => void;
    clearCart: () => void;
    applyCoupon: (code: string) => { success: boolean; message: string };
    removeCoupon: () => void;
    appliedCoupon: string | null;
    totalItems: number;
    subtotal: number;
    gstTotal: number;
    discountAmount: number;
    total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("cart");
        const storedCoupon = localStorage.getItem("coupon");
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        if (storedCoupon) {
            setAppliedCoupon(storedCoupon);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem("coupon", appliedCoupon);
        } else {
            localStorage.removeItem("coupon");
        }
    }, [appliedCoupon]);

    const addToCart = (newItem: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === newItem.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === newItem.id
                        ? { ...i, count: Math.min(i.count + newItem.count, i.stock) }
                        : i
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, count: number) => {
        setItems((prev) =>
            prev.map((i) => {
                if (i.id === id) {
                    return { ...i, count: Math.min(Math.max(1, count), i.stock) };
                }
                return i;
            })
        );
    };

    const clearCart = () => {
        setItems([]);
        setAppliedCoupon(null);
    };

    const applyCoupon = (code: string) => {
        // Mock hardcoded coupon bgmi for 15% discount
        if (code.toLowerCase() === 'bgmi') {
            setAppliedCoupon('bgmi');
            return { success: true, message: 'Coupon applied successfully! (15% OFF)' };
        }
        return { success: false, message: 'Invalid coupon code.' };
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const totalItems = items.reduce((acc, item) => acc + item.count, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.count, 0);

    // Apply 15% discount if coupon is 'bgmi'
    const discountAmount = appliedCoupon === 'bgmi' ? subtotal * 0.15 : 0;
    const discountedSubtotal = subtotal - discountAmount;

    // Calculate GST on discounted amount
    const gstTotal = items.reduce(
        (acc, item) => {
            const itemPrice = item.price * item.count;
            const itemDiscount = appliedCoupon === 'bgmi' ? itemPrice * 0.15 : 0;
            const itemDiscountedPrice = itemPrice - itemDiscount;
            return acc + (itemDiscountedPrice * (item.gst / 100));
        },
        0
    );

    const total = discountedSubtotal + gstTotal;

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                applyCoupon,
                removeCoupon,
                appliedCoupon,
                totalItems,
                subtotal,
                gstTotal,
                discountAmount,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
