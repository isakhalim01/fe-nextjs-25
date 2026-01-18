"use client";

import Layout from "@/components/ui/Layout";
import { service, serviceShow, serviceUpdate } from "@/services/services";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [products, setProducts] = useState<any[]>([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        product_id: "",
    });

    const getData = async () => {
        // Fetch variant data
        const variantResponse = await serviceShow("products-variants", id);
        if (!variantResponse.error) {
            const data = variantResponse.data;
            setForm({
                name: data.name,
                description: data.description || "",
                product_id: data.product_id || "",
            });
        }

        // Fetch products
        const productResponse = await service("products");
        if (!productResponse.error) {
            setProducts(productResponse.data);
        }
    };

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        setForm({
            ...form,
            [e.target.name as string]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Send as simple JSON object
        const payload = {
            name: form.name,
            description: form.description,
            product_id: form.product_id
        };

        const response = await serviceUpdate("products-variants", payload, id);

        if (!response.error) {
            alert("Product variant updated successfully");
            router.push("/product-variant");
        } else {
            alert("Failed to update product variant");
        }
    };

    return (
        <Layout>
            <div className="mb-4">
                <h1 className="text-xl font-bold text-black">Edit Variant</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
                <TextField
                    label="Variant Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth required>
                    <InputLabel shrink>Product</InputLabel>
                    <Select
                        name="product_id"
                        value={form.product_id}
                        label="Product"
                        onChange={(e) => handleChange(e as any)}
                        displayEmpty
                    >
                        {products.map((prod) => (
                            <MenuItem key={prod.id} value={prod.id}>
                                {prod.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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
                    <Link href="/product-variant">
                        <Button variant="outlined" color="secondary">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </Layout>
    );
}
