'use client';

import { useEffect, useState } from 'react';

interface Produk {
  id: number;
  nama: string;
  harga: number;
  stok: number;
}

export default function DashboardProductCRUD() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [form, setForm] = useState({ nama: '', harga: '', stok: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/product');
    const data = await res.json();
    setProducts(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      nama: form.nama,
      harga: Number(form.harga),
      stok: Number(form.stok),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/product/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const updated = await res.json();
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        setMessage('Produk berhasil diupdate');
      } else {
        const res = await fetch('/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
        setMessage('Produk berhasil ditambahkan');
      }

      setForm({ nama: '', harga: '', stok: '' });
      setEditingId(null);
    } catch (error) {
      setMessage('Terjadi kesalahan saat menyimpan data');
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/product/${id}`, { method: 'DELETE' });
    setProducts(products.filter((p) => p.id !== id));
    setMessage('Produk berhasil dihapus');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (product: Produk) => {
    setForm({ nama: product.nama, harga: String(product.harga), stok: String(product.stok) });
    setEditingId(product.id);
  };

  return (
    <div className="border rounded-lg p-6 shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Manajemen Produk</h2>

      {message && <div className="mb-4 text-green-600 font-medium">{message}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Nama Produk"
          className="border p-2 rounded"
          required
        />
        <input
          name="harga"
          value={form.harga}
          onChange={handleChange}
          type="number"
          placeholder="Harga"
          className="border p-2 rounded"
          required
        />
        <input
          name="stok"
          value={form.stok}
          onChange={handleChange}
          type="number"
          placeholder="Stok"
          className="border p-2 rounded"
          required
        />
        <div className="md:col-span-3 flex items-center gap-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${editingId ? 'bg-yellow-500' : 'bg-blue-600'} hover:opacity-90`}
          >
            {loading ? 'Menyimpan...' : editingId ? 'Update Produk' : 'Tambah Produk'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ nama: '', harga: '', stok: '' });
              }}
              className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Harga</th>
            <th className="border p-2">Stok</th>
            <th className="border p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.nama}</td>
              <td className="border p-2">Rp {p.harga.toLocaleString()}</td>
              <td className="border p-2">{p.stok}</td>
              <td className="border p-2 text-center space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
