"use client";

import Layout from "@/components/ui/Layout";
import { service, serviceDestroy } from "@/services/services";
import React, { useEffect, useState } from "react";
import { DataGrid, GridRowsProp, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import Link from "next/link";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [rows, setRows] = useState<any>([]);

  const getData = async () => {
    const response = await service("category-products");
    if (!response.error) {
      setRows(response.data);
    }
    console.log(response);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const response = await serviceDestroy("category-products", id);
      if (!response.error) {
        alert("Category deleted successfully");
        // Update state locally
        setRows((prevRows: any[]) => prevRows.filter((row) => row.id !== id));
      } else {
        alert("Failed to delete category");
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Product Name", width: 200 },
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
          onClick={() => router.push(`/product-category/edit/${params.id}`)}
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
  ];

  return (
    <Layout>
      <div className="flex w-full justify-between items-center my-4">
        <h1 className="text-black">Product Category</h1>
        <Link href="/product-category/create">
          <Button variant="contained">Add New</Button>
        </Link>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} />
      </div>
    </Layout>
  );
}
