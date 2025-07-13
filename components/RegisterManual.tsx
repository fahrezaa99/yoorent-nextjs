"use client";
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Pastikan path benar

const RegisterManual: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(
        'Pendaftaran berhasil! Silakan cek email untuk verifikasi sebelum login.'
      );
      setEmail('');
      setPassword('');
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 350, margin: '0 auto' }}>
      <h2>Daftar Akun Baru</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Password (min 6 karakter)"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        minLength={6}
        style={{ display: 'block', width: '100%', marginBottom: 8 }}
      />
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Loading...' : 'Daftar'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </form>
  );
};

export default RegisterManual;
