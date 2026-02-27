import Link from "next/link";
import { Droplet, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 p-2 rounded-xl text-white">
                                <Droplet size={24} className="stroke-[2.5]" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">
                                Harshit Paints
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Your one-stop destination for premium automotive and home paints. Authorized dealers for Asian Paints, Deltron, ASPA, 2K & 4K finishes.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 hover:text-white transition-colors duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition-colors duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-700 hover:text-white transition-colors duration-300">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Home', 'Shop Products', 'Brand Catalog', 'About Us', 'Contact'].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2">
                                        <span className="h-1 w-1 bg-blue-500 rounded-full opacity-0 -ml-3 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0"></span>
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Brands */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
                            Top Brands
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Asian Paints', 'Deltron Automotive', 'ASPA Refinish', 'Turbo Clearcoats', '2K & 4K Solid Colors'].map((brand) => (
                                <li key={brand}>
                                    <Link href={`/brands/${brand.toLowerCase().split(' ')[0]}`} className="text-gray-400 hover:text-white transition-colors">
                                        {brand}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-blue-500 shrink-0 mt-1" />
                                <span className="text-sm text-gray-400">123 Color Street, Industrial Area Phase 1,<br />Paint City, PC 56789</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-blue-500 shrink-0" />
                                <span className="text-sm text-gray-400">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-blue-500 shrink-0" />
                                <span className="text-sm text-gray-400">support@harshitpaints.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Harshit Paints. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
