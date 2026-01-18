'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link as MuiLink,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { serviceStore } from '@/services/services';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const password_confirmation = formData.get('password_confirmation');

    if (password !== password_confirmation) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Konfirmasi password tidak cocok!',
      });
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: password,
      password_confirmation: password_confirmation
    };

    try {
      const response = await serviceStore('auth/register', payload);

      if (response.error) {
        let errorMessage = response.message || 'Registration failed';

        // If there are specific validation errors, append them
        if (response.data) {
          const errors = response.data;
          const errorDetails = Object.values(errors).flat().join('\n');
          if (errorDetails) {
            errorMessage += `\n${errorDetails}`;
          }
        }

        throw new Error(errorMessage);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Akun Anda telah dibuat. Silakan login.',
        timer: 1500,
        showConfirmButton: false,
      });

      router.push('/login');
      router.refresh();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Pendaftaran Gagal',
        text: error.message || 'Coba email lain atau periksa input Anda',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f4f6f8',
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3
          }}
        >
          <Box
            sx={{
              mb: 3,
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <Person />
          </Box>
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            Daftar Akun
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mulai kelola produk Anda sekarang
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nama Lengkap"
              name="name"
              autoComplete="name"
              autoFocus
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Alamat Email"
              name="email"
              autoComplete="email"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password_confirmation"
              label="Konfirmasi Password"
              type={showPassword ? 'text' : 'password'}
              id="password_confirmation"
              autoComplete="new-password"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Buat Akun'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Sudah punya akun?{' '}
                <MuiLink component={Link} href="/login" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                  Login
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}