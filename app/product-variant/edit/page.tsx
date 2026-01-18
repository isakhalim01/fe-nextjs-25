'use client';

import Layout from '@/components/ui/Layout';
import { service, serviceShow, serviceUpdate } from '@/services/services';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, use } from 'react';
import Swal from 'sweetalert2';

export default function ProductVariantEdit({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchInitialData = async () => {
      try {
        const [variantRes, productRes] = await Promise.all([
          serviceShow('product_variants', id),
          service('products')
        ]);
        setData(variantRes.data);
        setProducts(productRes.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch data', 'error');
        router.push('/product-variants');
      }
    };
    fetchInitialData();
  }, [id, router]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('_method', 'PUT');

    try {
      await serviceUpdate('product_variants', formData, id);
      Swal.fire('Success', 'Variant updated successfully', 'success');
      router.push('/product-variants');
    } catch (error: any) {
      Swal.fire('Error', error?.response?.data?.message || 'Failed to update variant', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-black text-2xl font-bold mb-4">Edit Product Variant</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth variant="standard" required>
            <InputLabel shrink>Product</InputLabel>
            <Select 
              name="product_id" 
              defaultValue={data.product_id}
            >
              {products.map((prod) => (
                <MenuItem key={prod.id} value={prod.id}>
                  {prod.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField 
            name="name" 
            label="Variant Name" 
            variant="standard" 
            defaultValue={data.name} 
            required 
            fullWidth 
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField 
            name="description" 
            label="Description" 
            variant="standard" 
            defaultValue={data.description} 
            fullWidth 
            multiline 
            rows={2} 
            className="md:col-span-2"
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outlined" color="secondary" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </Layout>
  );
}