"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, Droplet, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { totalItems } = useCart();
    const { user, logout } = useAuth();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "Brands", href: "/brands" },
        { name: "About Us", href: "/about" },
    ];

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 glass border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                            <Droplet size={24} className="stroke-[2.5]" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            Harshit Paints
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/cart" className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Hi, {user.name.split(' ')[0]}
                                </span>
                                {user.role === 'ADMIN' && (
                                    <Link href="/admin" className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-700 transition">
                                        Admin
                                    </Link>
                                )}
                                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 rounded-full">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                <User size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/cart" className="relative text-gray-600 dark:text-gray-300">
                            <ShoppingCart size={24} />
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 dark:text-gray-300 focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 shadow-xl border-b border-gray-200 dark:border-gray-800"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <div className="text-sm font-medium text-gray-500 px-4">Logged in as {user.name}</div>
                                        {user.role === 'ADMIN' && (
                                            <Link href="/admin" onClick={() => setIsOpen(false)} className="w-full text-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold py-3 rounded-xl">
                                                Go to Admin
                                            </Link>
                                        )}
                                        <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-center bg-red-50 dark:bg-red-900/20 text-red-600 font-bold py-3 rounded-xl flex justify-center items-center gap-2">
                                            <LogOut size={18} /> Log out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                                    >
                                        <User size={20} />
                                        Login / Signup
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
