     "use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Produk {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  warna: string;
  foto?: string;
}

export default function DashboardProductCRUD() {
  const [product, setProduct] = useState<Produk[]>([]);
  const [form, setForm] = useState({ nama: '', harga: '', stok: '', warna: '', foto: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/product');
        if (!response.ok) throw new Error('Gagal mengambil produk');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setMessage('Gagal mengambil data produk');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const filteredProducts = product.filter(product =>
    product.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('File harus berupa gambar (jpg, png, dll)');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Ukuran file tidak boleh melebihi 2MB');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!form.nama || !form.harga || !form.stok || !form.warna) {
      setMessage('Nama, harga, stok, dan warna wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setLoading(true);

    const body = {
      nama: form.nama,
      harga: Number(form.harga),
      stok: Number(form.stok),
      warna: form.warna,
      foto: form.foto || null,
    };

    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal menambah produk: ${errorText || 'Server error'}`);
      }
      const newProduct = await response.json();
      console.log('API Response:', newProduct);
      const updatedProduct = { ...newProduct, id: newProduct.id || Date.now() };
      setProduct([...product, updatedProduct]);
      setMessage('Produk berhasil ditambahkan');
      setForm({ nama: '', harga: '', stok: '', warna: '', foto: '' });
    } catch (error: any) { // Menambahkan tipe any untuk error
      setMessage(`Terjadi kesalahan saat menambah produk: ${error.message || error}`);
      console.error('Error creating product:', error);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async () => {
    if (!editingId) return;
    if (!form.nama || !form.harga || !form.stok || !form.warna) {
      setMessage('Nama, harga, stok, dan warna wajib diisi');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setLoading(true);

    const body = {
      nama: form.nama,
      harga: Number(form.harga),
      stok: Number(form.stok),
      warna: form.warna,
      foto: form.foto || null,
    };

    try {
      const response = await fetch(`/api/product/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal mengupdate produk: ${errorText || 'Server error'}`);
      }
      const updatedProduct = await response.json();
      setProduct(product.map((p) => (p.id === editingId ? updatedProduct : p)));
      setMessage('Produk berhasil diupdate');
      setForm({ nama: '', harga: '', stok: '', warna: '', foto: '' });
      setEditingId(null);
    } catch (error: any) { // Menambahkan tipe any untuk error
      setMessage(`Terjadi kesalahan saat mengupdate produk: ${error.message || error}`);
      console.error('Error updating product:', error);
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProduct(product.filter((p) => p.id !== id));
        setMessage('Produk berhasil dihapus');
      } else {
        const errorText = await response.text();
        throw new Error(`Gagal menghapus produk: ${errorText || 'Server error'}`);
      }
    } catch (error: any) { // Menambahkan tipe any untuk error
      setMessage(`Gagal menghapus produk: ${error.message || error}`);
      console.error('Error deleting product:', error);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (product: Produk) => {
    setForm({
      nama: product.nama,
      harga: String(product.harga),
      stok: String(product.stok),
      warna: product.warna,
      foto: product.foto || '',
    });
    setEditingId(product.id);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ nama: '', harga: '', stok: '', warna: '', foto: '' });
  };

  return (
    <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Manajemen Produk</h1>
          <p className="text-blue-100 text-lg">Kelola produk Anda dengan mudah</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-center font-medium ${
            message.includes('berhasil')
              ? 'bg-green-500/20 backdrop-blur-sm border border-green-300/30 text-green-100'
              : 'bg-red-500/20 backdrop-blur-sm border border-red-300/30 text-red-100'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <Plus className="w-6 h-6" />
            {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Nama Produk</label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama produk"
                  className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Harga</label>
                <input
                  name="harga"
                  value={form.harga}
                  onChange={handleChange}
                  type="number"
                  placeholder="Masukkan harga"
                  className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Stok</label>
                <input
                  name="stok"
                  value={form.stok}
                  onChange={handleChange}
                  type="number"
                  placeholder="Masukkan stok"
                  className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Warna</label>
                <input
                  name="warna"
                  value={form.warna}
                  onChange={handleChange}
                  placeholder="Masukkan warna"
                  className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Foto Produk (Opsional)</label>
                <input
                  name="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
                {form.foto && (
                  <div className="mt-2">
                    <img
                      src={form.foto}
                      alt="Pratinjau"
                      className="w-24 h-24 object-cover rounded-lg border border-white/20"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={editingId ? handleSubmit : handleCreate}
                disabled={loading || !form.nama || !form.harga || !form.stok || !form.warna}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {loading ? 'Menyimpan...' : editingId ? 'Update Produk' : 'Tambah Produk'}
              </button>
              
              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500/20 backdrop-blur-sm border border-gray-300/20 text-white font-medium rounded-xl hover:bg-gray-500/30 transition-all duration-300"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Daftar Produk</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 text-white/90 font-medium">NO.</th>
                  <th className="text-left py-4 px-4 text-white/90 font-medium">FOTO</th>
                  <th className="text-left py-4 px-4 text-white/90 font-medium">NAMA PRODUK</th>
                  <th className="text-left py-4 px-4 text-white/90 font-medium">HARGA</th>
                  <th className="text-left py-4 px-4 text-white/90 font-medium">STOK</th>
                  <th className="text-left py-4 px-4 text-white/90 font-medium">WARNA</th>
                  <th className="text-left py-4 px-4 text-white/90 font-medium">STATUS</th>
                  <th className="text-center py-4 px-4 text-white/90 font-medium">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-white/60">
                      Memuat data...
                    </td>
                  </tr>
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, index) => (
                    <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white">{startIndex + index + 1}</td>
                      <td className="py-4 px-4">
                        {product.foto ? (
                          <img
                            src={product.foto}
                            alt={product.nama}
                            className="w-12 h-12 object-cover rounded-lg border border-white/20"
                          />
                        ) : (
                          <span className="text-white/60">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-white font-medium">{product.nama}</td>
                      <td className="py-4 px-4 text-white">Rp {product.harga.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-4 text-white">{product.stok}</td>
                      <td className="py-4 px-4 text-white">{product.warna}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stok > 10 
                            ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                            : product.stok > 0 
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                            : 'bg-red-500/20 text-red-300 border border-red-400/30'
                        }`}>
                          {product.stok > 10 ? 'Tersedia' : product.stok > 0 ? 'Terbatas' : 'Habis'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-105"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300 transform hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-white/60">
                      Tidak ada produk yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-white/70 text-sm">
              Menampilkan {Math.min(startIndex + 1, filteredProducts.length)} - {Math.min(startIndex + itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} produk
            </div>
            
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}