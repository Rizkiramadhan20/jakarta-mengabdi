"use client";

import React from "react";

import { usePathname } from "next/navigation";

import { Toaster } from "react-hot-toast";

import Header from "@/components/layout/Header/Header";

import Footer from "@/components/layout/Footer/Footer";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isAdminRoute =
        pathname?.includes("/signup") ||
        pathname?.includes("/signin") ||
        pathname?.includes("/forgot-password") ||
        pathname?.includes("/dashboard") || false;

    return (
        <main>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#22c55e',
                            color: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                            color: '#fff',
                        },
                    },
                }}
            />
            {!isAdminRoute && <Header />}
            {children}
            {!isAdminRoute && <Footer />}
        </main>
    );
};

export default Pathname;