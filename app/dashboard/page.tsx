"use client";

import Layout from "@/components/ui/Layout";
import React from "react";

export default function Page() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Welcome to your dashboard!</p>
            </div>
        </Layout>
    );
}
