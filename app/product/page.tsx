"use client";

import Layout from "@/components/ui/Layout";
import { service, serviceDestroy } from "@/services/services";
import React, { useEffect, useState, useMemo } from "react";
import { DataGrid, GridRowsProp, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import Link from "next/link";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [rows, setRows] = useState<any>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const getData = async () => {
    // Fetch products
    const response = await service("products");
    if (!response.error) {
      setRows(response.data);
    }
    console.log(response);

    // Fetch categories for mapping
    const categoryResponse = await service("category-products");
    if (!categoryResponse.error) {
      setCategories(categoryResponse.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const response = await serviceDestroy("products", id);
      if (!response.error) {
        alert("Product deleted successfully");
        // Update state locally to verify deletion visually
        setRows((prevRows: any[]) => prevRows.filter((row) => row.id !== id));
      } else {
        alert("Failed to delete product");
      }
    }
  };

  const columns: GridColDef[] = useMemo(() => [
    { field: "name", headerName: "Product Name", width: 200 },
    { field: "code", headerName: "Code", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      valueGetter: (_value: any, row: any) => {
        // Handle different possible structures from API
        if (row?.product_category?.name) {
          return row.product_category.name;
        }
        if (row?.category?.name) {
          return row.category.name;
        }
        // If only product_category_id is available, map it with categories list
        if (row?.product_category_id) {
          const categoryId = typeof row.product_category_id === 'object' 
            ? row.product_category_id.id || row.product_category_id 
            : row.product_category_id;
          const category = categories.find((cat: any) => cat.id === categoryId);
          return category?.name || '-';
        }
        return '-';
      }
    },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => router.push(`/product/edit/${params.id}`)}
          key="edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
          key="delete"
        />,
      ],
    },
  ], [categories, router]);

  return (
    <Layout>
      <div className="flex w-full justify-between items-center my-4">
        <h1 className="text-black">Product</h1>
        <Link href="/product/create">
          <Button variant="contained">Add New</Button>
        </Link>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} />
      </div>
    </Layout>
  );
}
