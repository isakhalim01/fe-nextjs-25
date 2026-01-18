"use client";

import Layout from "@/components/ui/Layout";
import { service, serviceStore } from "@/services/services";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    code: "",
    price: "",
    description: "",
    product_category_id: "",
    image: "",
  });

  useEffect(() => {
    const getCategories = async () => {
      const response = await service("category-products");
      if (!response.error) {
        setCategories(response.data);
      }
    };
    getCategories();
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
      code: form.code,
      price: form.price,
      description: form.description,
      product_category_id: form.product_category_id
    };

    const response = await serviceStore("products", payload);
    if (!response.error) {
      alert("Product created successfully");
      router.push("/product");
    } else {
      alert("Failed to create product");
    }
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-black">Add New Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <TextField
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
          fullWidth
        />
        <FormControl fullWidth required>
          <InputLabel shrink>Category</InputLabel>
          <Select
            name="product_category_id"
            value={form.product_category_id}
            label="Category"
            onChange={(e) => handleChange(e as any)}
            displayEmpty
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
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
          <Link href="/product">
            <Button variant="outlined" color="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Layout>
  );
}