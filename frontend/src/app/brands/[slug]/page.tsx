"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BrandRedirectPage() {
    const { slug } = useParams();
    const router = useRouter();

    useEffect(() => {
        // We need to fetch all brands to find the ID matching the slug
        fetch("http://localhost:5000/api/products/brands")
            .then((res) => res.json())
            .then((brands: any[]) => {
                // Simple matching logic mapping the URL slug to the backend brand name
                const match = brands.find((b) => {
                    const formattedName = b.brand_name.toLowerCase().replace(/\s+/g, '-');
                    return formattedName.includes(slug as string) || (slug as string).includes(formattedName);
                });

                if (match) {
                    router.replace(`/products?brand_id=${match.id}`);
                } else {
                    router.replace('/brands');
                }
            })
            .catch((err) => {
                console.error("Error fetching brands for redirect:", err);
                router.replace('/brands');
            });
    }, [slug, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loading Brand...</h2>
                <p className="text-gray-500 mt-2">Redirecting to the product catalog</p>
            </div>
        </div>
    );
}
