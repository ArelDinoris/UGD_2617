"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  warna?: string;
  foto?: string;
  deskripsi?: string;
}

const ProductSkeleton = () => {
  return (
    <div className="bg-[#242870] rounded-2xl p-6 animate-pulse">
      <div className="flex flex-row">
        <div className="flex items-center justify-center w-1/2">
          <div className="w-32 h-32 bg-gray-600 rounded-lg" />
        </div>
        <div className="flex flex-col items-end justify-center text-white w-1/2 space-y-2">
          <div className="w-3/4 h-5 bg-gray-500 rounded" />
          <div className="w-1/2 h-4 bg-gray-500 rounded" />
          <div className="w-4 h-4 bg-gray-400 rounded-full my-2" />
          <div className="w-1/2 h-4 bg-gray-500 rounded" />
          <div className="w-2/3 h-6 bg-gray-400 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="w-full h-10 bg-gray-500 rounded" />
        <div className="w-full h-10 bg-gray-500 rounded" />
      </div>
    </div>
  );
};

const ButtonSkeleton = ({ width, height }: { width: string; height: string }) => {
  return (
    <div
      className={`bg-gray-500 rounded flex items-center justify-center animate-pulse`}
      style={{ width, height }}
    />
  );
};

const InputSkeleton = ({ width, height }: { width: string; height: string }) => {
  return (
    <div
      className={`bg-gray-500 rounded animate-pulse`}
      style={{ width, height }}
    />
  );
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    nama: "",
    harga: 0,
    stok: 0,
    warna: "",
    foto: "",
    deskripsi: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/product");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "nama" ||
        e.target.name === "warna" ||
        e.target.name === "deskripsi"
          ? e.target.value
          : +e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.nama || form.harga <= 0 || form.stok < 0) {
      setMessage("Mohon isi semua field dengan benar!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    try {
      const body = {
        nama: form.nama,
        harga: form.harga,
        stok: form.stok,
        warna: form.warna,
        foto: form.foto,
      };

      if (editingId) {
        const res = await fetch(`/api/product/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update product");
        const updatedProduct = await res.json();
        setProducts(
          products.map((p) =>
            p.id === editingId ? updatedProduct : p
          )
        );
        setMessage("Produk berhasil diupdate");
      } else {
        const res = await fetch("/api/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to add product");
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
        setMessage("Produk berhasil ditambahkan");
      }
    } catch (err: any) {
      console.error("Error submitting product:", err);
      setMessage(`Terjadi kesalahan: ${err.message || "Server error"}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
      setForm({ nama: "", harga: 0, stok: 0, warna: "", foto: "", deskripsi: "" });
      setEditingId(null);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      nama: product.nama,
      harga: product.harga,
      stok: product.stok,
      warna: product.warna || "",
      foto: product.foto || "",
      deskripsi: product.deskripsi || "",
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setLoading(true);
      try {
        const res = await fetch(`/api/product/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete product");
        setProducts(products.filter((p) => p.id !== id));
        setMessage("Produk berhasil dihapus");
      } catch (err: any) {
        console.error("Error deleting product:", err);
        setMessage(`Terjadi kesalahan: ${err.message || "Server error"}`);
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const cancelEdit = () => {
    setForm({ nama: "", harga: 0, stok: 0, warna: "", foto: "", deskripsi: "" });
    setEditingId(null);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#1a1f4d] p-4">
      {/* Product Management Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Form Card */}
        {!loading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingId ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                name="nama"
                placeholder="Nama Produk"
                value={form.nama}
                onChange={handleChange}
                className="px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/30 transition-all duration-200"
              />
              <input
                type="number"
                name="harga"
                placeholder="Harga"
                value={form.harga || ""}
                onChange={handleChange}
                className="px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/30 transition-all duration-200"
              />
              <input
                type="number"
                name="stok"
                placeholder="Stok"
                value={form.stok || ""}
                onChange={handleChange}
                className="px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/30 transition-all duration-200"
              />
              <input
                type="text"
                name="warna"
                placeholder="Warna"
                value={form.warna}
                onChange={handleChange}
                className="px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/30 transition-all duration-200"
              />
              <input
                type="file"
                name="foto"
                accept="image/*"
                onChange={handleImageChange}
                className="px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/30 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="col-span-full sm:col-span-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Menyimpan..." : editingId ? "Update Produk" : "Tambah Produk"}
              </button>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="col-span-full sm:col-span-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Batal Edit
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">Daftar Produk</h3>
          </div>
          <div>
            <table className="w-full table-fixed">
              <thead className="bg-white/5 backdrop-blur">
                <tr>
                  <th className="w-[5%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="w-[20%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="w-[10%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="w-[10%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="w-[10%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Warna
                  </th>
                  <th className="w-[10%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-[20%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-white/60">
                      Memuat data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-white/60">
                      {error}
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-white/90">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        {product.foto ? (
                          <div className="relative w-12 h-12">
                            <Image
                              src={product.foto}
                              alt={product.nama}
                              layout="fill"
                              objectFit="contain"
                              className="rounded-lg"
                            />
                          </div>
                        ) : (
                          <span className="text-white/60">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white break-words">
                        {product.nama}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90">
                        Rp {product.harga.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90">
                        {product.stok} unit
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90">
                        {product.warna || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            product.stok > 10
                              ? "bg-green-400/20 text-green-300 border border-green-400/30"
                              : product.stok > 0
                              ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                              : "bg-red-400/20 text-red-300 border border-red-400/30"
                          }`}
                        >
                          {product.stok > 10
                            ? "Tersedia"
                            : product.stok > 0
                            ? "Terbatas"
                            : "Habis"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/30 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-white/60">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-white/70">
          Menampilkan {startIndex + 1} -{" "}
          {Math.min(startIndex + itemsPerPage, products.length)} dari{" "}
          {products.length} produk
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white disabled:opacity-50 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur transition-all duration-200"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-xl backdrop-blur transition-all duration-200 ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white bg-white/10 hover:bg-white/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white disabled:opacity-50 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}