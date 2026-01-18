"use client";

import Layout from "@/components/ui/Layout";
import { serviceShow, serviceUpdate } from "@/services/services";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const getData = async () => {
        const response = await serviceShow("category-products", id);
        if (!response.error) {
            setForm({
                name: response.data.name,
                description: response.data.description || "",
            });
        }
    };

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Send as simple JSON object
        const payload = {
            name: form.name,
            description: form.description,
        };

        const response = await serviceUpdate("category-products", payload, id);

        if (!response.error) {
            alert("Category updated successfully");
            router.push("/product-category");
        } else {
            alert("Failed to update category");
        }
    };

    return (
        <Layout>
            <div className="mb-4">
                <h1 className="text-xl font-bold text-black">Edit Category</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
                <TextField
                    label="Category Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    InputLabelProps={{ shrink: true }}
                />
                <div className="flex gap-2">
                    <Button type="submit" variant="contained" color="primary">
                        Update
                    </Button>
                    <Link href="/product-category">
                        <Button variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </Layout>
    );
}
