"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Package, Users, DollarSign, LayoutDashboard, AlertCircle, TrendingUp } from "lucide-react";

type OrderItem = {
    id: string;
    quantity_selected: string;
    price: number;
    qty: number;
    product: {
        name: string;
    }
};

type Order = {
    id: string;
    total_amount: number;
    gst_amount: number;
    final_amount: number;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    orderItems: OrderItem[];
};

export default function AdminDashboard() {
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthLoading) return;

        if (!user || user.role !== "ADMIN") {
            router.replace("/");
            return;
        }

        fetchOrders();
    }, [user, isAuthLoading, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/admin/orders", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await res.json();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-dark-950">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4">
                    <AlertCircle size={32} />
                    <div>
                        <h3 className="font-bold text-lg">Error loading administration data</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate stats
    const totalRevenue = orders.reduce((acc, order) => acc + order.final_amount, 0);
    const totalOrders = orders.length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-500/30">
                            <LayoutDashboard size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Control Panel</h1>
                            <p className="text-gray-500">Welcome back, {user?.name}. Here's what's happening today.</p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

                    <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6">
                        <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">₹{Math.round(totalRevenue).toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6">
                        <div className="h-16 w-16 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center shrink-0">
                            <Package size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalOrders}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6">
                        <div className="h-16 w-16 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Active Admin</p>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user?.email}</h3>
                        </div>
                    </div>

                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-dark-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-900/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-sm">
                                    <th className="py-4 px-6 font-semibold">Order ID</th>
                                    <th className="py-4 px-6 font-semibold">Customer</th>
                                    <th className="py-4 px-6 font-semibold">Items</th>
                                    <th className="py-4 px-6 font-semibold">Date</th>
                                    <th className="py-4 px-6 font-semibold">Status</th>
                                    <th className="py-4 px-6 font-semibold text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500">
                                            No orders have been placed yet.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                            <td className="py-4 px-6 text-sm font-mono text-gray-600 dark:text-gray-400">
                                                #{order.id.slice(0, 8)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-gray-900 dark:text-white">{order.user.name}</div>
                                                <div className="text-xs text-gray-500">{order.user.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                                    {order.orderItems.map((item, idx) => (
                                                        <div key={idx} className="truncate max-w-[200px]" title={`${item.qty}x ${item.product.name} (${item.quantity_selected})`}>
                                                            {item.qty}x {item.product.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-gray-900 dark:text-white">
                                                ₹{Math.round(order.final_amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
