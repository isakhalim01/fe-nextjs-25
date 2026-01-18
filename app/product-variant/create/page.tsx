"use client";

import Layout from "@/components/ui/Layout";
import { service, serviceStore } from "@/services/services";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    product_id: "",
  });

  useEffect(() => {
    const getProducts = async () => {
      const response = await service("products");
      if (!response.error) {
        setProducts(response.data);
      }
    };
    getProducts();
  }, []);

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

    const response = await serviceStore("products-variants", payload);
    if (!response.error) {
      alert("Product variant created successfully");
      router.push("/product-variant");
    } else {
      alert("Failed to create product variant");
    }
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-black">Add New Variant</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <TextField
          label="Variant Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <FormControl fullWidth required>
          <InputLabel>Product</InputLabel>
          <Select
            name="product_id"
            value={form.product_id}
            label="Product"
            onChange={(e) => handleChange(e as any)}
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
        />
        <div className="flex gap-2">
          <Button type="submit" variant="contained" color="primary">
            Save
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