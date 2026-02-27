"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

type Brand = {
    id: string;
    brand_name: string;
    discount_percentage: number;
};

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/products/brands")
            .then((res) => res.json())
            .then((data) => setBrands(data))
            .catch((err) => console.error("Error fetching brands:", err))
            .finally(() => setIsLoading(false));
    }, []);

    // Map backend brands to visually appealing cards
    const getBrandDetails = (brandName: string) => {
        const lowercaseName = brandName.toLowerCase();
        if (lowercaseName.includes("asian")) {
            return {
                logo: "https://images.seeklogo.com/logo-png/31/2/asian-paints-logo-png_seeklogo-315813.png",
                color: "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50 hover:border-blue-500/50 hover:shadow-blue-500/20",
                description: "India's leading paint company with an extensive range of interior and exterior decor solutions."
            };
        }
        if (lowercaseName.includes("deltron")) {
            return {
                logo: null,
                textLogo: "DELTRON",
                color: "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/50 hover:border-red-500/50 hover:shadow-red-500/20",
                description: "Premium automotive refinish paints providing world-class glossy finishes and protection."
            };
        }
        if (lowercaseName.includes("aspa")) {
            return {
                logo: null,
                textLogo: "ASPA",
                color: "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-500/50 hover:shadow-indigo-500/20",
                description: "Cost-effective 2K automotive solid colors with excellent durability."
            };
        }

        return {
            logo: null,
            textLogo: brandName,
            color: "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:border-gray-500/50 hover:shadow-gray-500/20",
            description: "Premium quality paints and finishes."
        };
    };

    return (
        <div className="bg-white dark:bg-dark-950 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Our Premium Brands</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        We partner with the industry's top manufacturers to bring you unmatched quality across home decorators and automotive refinish series.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : brands.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {brands.map((brand) => {
                            const details = getBrandDetails(brand.brand_name);

                            return (
                                <Link
                                    href={`/products?brand_id=${brand.id}`}
                                    key={brand.id}
                                    className={`group rounded-3xl p-8 border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center ${details.color}`}
                                >
                                    <div className="h-32 flex items-center justify-center mb-6">
                                        {details.logo ? (
                                            <img src={details.logo} alt={brand.brand_name} className="max-h-full max-w-[200px] object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <span className="text-4xl font-black italic text-gray-800 dark:text-white tracking-widest group-hover:scale-110 transition-transform duration-500">
                                                {details.textLogo}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{brand.brand_name}</h3>
                                    <div className="flex items-center gap-1 text-yellow-500 mb-4">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow">
                                        {details.description}
                                    </p>

                                    <div className="flex items-center justify-between w-full mt-auto">
                                        <span className="inline-flex items-center px-3 py-1 bg-white/60 dark:bg-black/20 rounded-full text-sm font-semibold text-green-600 dark:text-green-400">
                                            Up to {brand.discount_percentage}% OFF
                                        </span>
                                        <span className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors shadow-sm">
                                            <ArrowRight size={20} />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No brands available</h3>
                        <p className="text-gray-500">Check back later or contact support.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
