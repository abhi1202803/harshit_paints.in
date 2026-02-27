import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />

        {/* Optional Video/Image Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2670&auto=format&fit=crop"
            alt="Premium Paint Shop Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold text-white mb-4 animate-fade-in-up">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Authorized Dealer for Asian Paints & Deltron
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight max-w-3xl leading-[1.1] animate-fade-in-up animation-delay-150">
            Transform Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              World With Color
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-xl animate-fade-in-up animation-delay-300">
            Premium interior, exterior, and automotive paints. Experience unmatched quality, durability, and vibrant finishes for your home and vehicles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-up animation-delay-450">
            <Link href="/products" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link href="/brands" className="bg-white/10 text-white backdrop-blur-md px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center text-center">
              Explore Brands
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURES GRID */}
      <section className="py-16 bg-white dark:bg-dark-950 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "100% Genuine", desc: "Sourced directly from manufacturers", color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/20" },
              { icon: Truck, title: "Fast Delivery", desc: "Same-day dispatch available", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" },
              { icon: Zap, title: "Dynamic Pricing", desc: "Wholesale rates for bulk sizing", color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/20" },
              { icon: Star, title: "Premium Support", desc: "Expert advice on paint selection", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20" },
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-dark-900 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                <div className={`${feat.bg} ${feat.color} p-3 rounded-xl shrink-0`}>
                  <feat.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{feat.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED BRANDS */}
      <section className="py-24 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Official Brand Partners</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">We bring you the absolute best from the industry's leading manufacturers for both architectural and automotive needs.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {/* Asian Paints */}
            <Link href="/brands/asian-paints" className="group rounded-3xl p-8 bg-white dark:bg-dark-900 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="w-32 h-32 relative">
                <img src="https://images.seeklogo.com/logo-png/31/2/asian-paints-logo-png_seeklogo-315813.png" alt="Asian Paints" className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Asian Paints</span>
            </Link>

            {/* Deltron */}
            <Link href="/brands/deltron" className="group rounded-3xl p-8 bg-white dark:bg-dark-900 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:border-red-500/30 transition-all cursor-pointer">
              <div className="w-32 h-32 relative flex items-center justify-center">
                <span className="text-4xl font-black italic text-gray-300 dark:text-gray-600 group-hover:text-red-600 transition-colors">DELTRON</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">Automotive Refinish</span>
            </Link>

            {/* ASPA */}
            <Link href="/brands/aspa" className="group rounded-3xl p-8 bg-white dark:bg-dark-900 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:border-indigo-500/30 transition-all cursor-pointer">
              <div className="w-32 h-32 relative flex items-center justify-center">
                <div className="h-20 w-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="text-indigo-600 w-10 h-10" />
                </div>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">ASPA Paints</span>
            </Link>

            {/* 2K / 4K */}
            <Link href="/brands/2k" className="group rounded-3xl p-8 bg-white dark:bg-dark-900 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:border-green-500/30 transition-all cursor-pointer">
              <div className="w-32 h-32 relative flex items-center justify-center">
                <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-2xl rotate-12 group-hover:rotate-0 flex items-center justify-center transition-transform">
                  <span className="text-2xl font-black text-green-600">2K/4K</span>
                </div>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">Solid Colors</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-20 relative overflow-hidden bg-blue-600">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Need Help Picking the Right Color?</h2>
          <p className="text-xl text-blue-100 mb-10">Our expert team is ready to assist you with estimations and product selection.</p>
          <Link href="/contact" className="inline-block bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-50 hover:shadow-xl hover:scale-105 transition-all">
            Contact An Expert
          </Link>
        </div>
      </section>

    </div>
  );
}
