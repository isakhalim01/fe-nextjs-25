"use client";

import Layout from "@/components/ui/Layout";
import { serviceStore } from "@/services/services";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

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

    const response = await serviceStore("category-products", payload);
    if (!response.error) {
      alert("Category created successfully");
      router.push("/product-category");
    } else {
      alert("Failed to create category");
    }
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-black">Add New Category</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <TextField
          label="Category Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
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
