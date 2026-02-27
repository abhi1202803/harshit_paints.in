"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, Search, ShoppingCart } from "lucide-react";

type Brand = {
    id: string;
    brand_name: string;
};

type Quantity = {
    quantity: string;
    base_price: number;
};

type Product = {
    id: string;
    name: string;
    description: string;
    images: string[];
    brand: Brand;
    quantities: Quantity[];
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch brands
        fetch("http://localhost:5000/api/products/brands")
            .then((res) => res.json())
            .then((data) => setBrands(data))
            .catch((err) => console.error("Error fetching brands:", err));

        // Fetch initial products
        fetchProducts();
    }, []);

    const fetchProducts = async (brandId?: string) => {
        setIsLoading(true);
        try {
            let url = "http://localhost:5000/api/products";
            if (brandId && brandId !== "all") {
                url += `?brand_id=${brandId}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBrandChange = (brandId: string) => {
        setSelectedBrand(brandId);
        fetchProducts(brandId);
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gray-50 dark:bg-dark-950 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Shop Products</h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">Browse our extensive collection of premium paints, exterior finishes, and automotive bases. Choose the perfect color and quantity for your needs.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search paints..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-3 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={selectedBrand}
                                onChange={(e) => handleBrandChange(e.target.value)}
                                className="pl-12 pr-10 py-3 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer w-full transition-all"
                            >
                                <option value="all">All Brands</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>{b.brand_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                )}

            </div>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    // Get starting price
    const lowestPrice = product.quantities.length > 0
        ? Math.min(...product.quantities.map(q => q.base_price))
        : 0;

    return (
        <Link href={`/products/${product.id}`} className="group bg-white dark:bg-dark-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="object-contain h-full w-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="text-gray-400 font-medium">No Image</div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 text-xs font-bold rounded-full text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700">
                    {product.brand.brand_name}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Starting from</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white">₹{lowestPrice.toLocaleString()}</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 h-10 w-10 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ShoppingCart size={20} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
