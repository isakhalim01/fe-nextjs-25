'use client';

import Layout from '@/components/ui/Layout';
import { serviceShow, serviceUpdate } from '@/services/services';
import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, use } from 'react';
import Swal from 'sweetalert2';

export default function ProductCategoryEdit({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
        try {
            const response = await serviceShow('product_categories', id);
            setData(response.data); 
        } catch (error) {
             Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch data',
            });
            router.push('/product-category');
        }
    }
    fetchData();
  }, [id, router]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('_method', 'PUT'); 

    try {
      await serviceUpdate('product_categories', formData, id);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product Category updated successfully',
      });
      router.push('/product-category');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.message || 'Failed to update category',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-black text-2xl font-bold">Edit Product Category</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <TextField 
            name="name" 
            id="name" 
            label="Name" 
            variant="standard" 
            defaultValue={data.name}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="description"
            id="description"
            label="Description"
            variant="standard"
            defaultValue={data.description}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="flex justify-end gap-2">
           <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </Layout>
  );
}