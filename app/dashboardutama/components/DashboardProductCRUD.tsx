"use client"
import { useEffect, useState } from "react"

interface Produk {
  id: number
  nama: string
  harga: number
  stok: number
}

export default function DashboardProductCRUD() {
  const [produkList, setProdukList] = useState<Produk[]>([])
  const [form, setForm] = useState({ nama: "", harga: 0, stok: 0 })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.name === "nama" ? e.target.value : +e.target.value
    })
  }

  const handleSubmit = async () => {
    if (!form.nama || form.harga <= 0 || form.stok < 0) {
      alert("Mohon isi semua field dengan benar!")
      return
    }

    if (editingId) {
      // Update existing product
      setProdukList(produkList.map(p =>
        p.id === editingId
          ? { ...p, nama: form.nama, harga: form.harga, stok: form.stok }
          : p
      ))
      setEditingId(null)
    } else {
      // Add new product
      const newId = Math.max(...produkList.map(p => p.id), 0) + 1
      const newProduk = { id: newId, ...form }
      setProdukList([...produkList, newProduk])
    }

    setForm({ nama: "", harga: 0, stok: 0 })
  }

  const handleEdit = (produk: Produk) => {
    setForm({ nama: produk.nama, harga: produk.harga, stok: produk.stok })
    setEditingId(produk.id)
  }

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setProdukList(produkList.filter(p => p.id !== id))
    }
  }

  const cancelEdit = () => {
    setForm({ nama: "", harga: 0, stok: 0 })
    setEditingId(null)
  }

  const totalPages = Math.ceil(produkList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = produkList.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl text-white flex items-center justify-center">
      {/* Content wrapper: wider (2xl) and horizontally centered */}
      <div className="max-w-screen-2xl w-full mx-auto py-12 px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-white">Manajemen Produk</h1>
        </div>

        {/* Product Management Section (Form and Table) */}
        {/* Menggunakan grid 1 kolom untuk form dan tabel agar tidak berdampingan dan punya ruang lebih */}
        {/* Jika ingin berdampingan lagi, ubah md:grid-cols-2 */}
        <div className="grid grid-cols-1 gap-6">

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
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
                value={form.harga || ''}
                onChange={handleChange}
                className="px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/30 transition-all duration-200"
              />
              <input
                type="number"
                name="stok"
                placeholder="Stok"
                value={form.stok || ''}
                onChange={handleChange}
                className="px-4 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/30 transition-all duration-200"
              />
              <button
                onClick={handleSubmit}
                // col-span-full membuat tombol mengambil seluruh lebar baris pada semua ukuran layar
                // Ini akan memberikan ruang yang cukup antara input dan tombol, serta antar tombol.
                className="col-span-full sm:col-span-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {editingId ? 'Update Produk' : 'Tambah Produk'}
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

          {/* Table Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Daftar Produk</h3>
            </div>

            {/* Hapus div dengan overflow-x-auto, karena kita akan mengatur lebar kolom */}
            <div>
              {/* Gunakan table-fixed untuk mengontrol lebar kolom lebih baik */}
              {/* Tambahkan `w-full` untuk memastikan tabel mengisi lebar kontainer */}
              <table className="w-full table-fixed">
                <thead className="bg-white/5 backdrop-blur">
                  <tr>
                    {/* Atur lebar kolom menggunakan w-xx. Sesuaikan nilai ini sesuai kebutuhan Anda */}
                    <th className="w-[5%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="w-[35%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Nama Produk
                    </th>
                    <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="w-[10%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Stok
                    </th>
                    <th className="w-[15%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-[20%] px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentData.map((produk, index) => (
                    <tr key={produk.id} className="hover:bg-white/5 transition-colors duration-200">
                      {/* Hapus whitespace-nowrap dari td agar teks bisa membungkus */}
                      <td className="px-6 py-4 text-sm text-white/90">
                        {startIndex + index + 1}
                      </td>
                      {/* Pastikan tidak ada whitespace-nowrap di sel nama produk */}
                      <td className="px-6 py-4 text-sm font-medium text-white break-words"> {/* break-words untuk kata yang sangat panjang */}
                        {produk.nama}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90">
                        Rp {produk.harga.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90">
                        {produk.stok} unit
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${produk.stok > 10
                            ? 'bg-green-400/20 text-green-300 border border-green-400/30'
                            : produk.stok > 0
                              ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                              : 'bg-red-400/20 text-red-300 border border-red-400/30'
                          }`}>
                          {produk.stok > 10 ? 'Tersedia' : produk.stok > 0 ? 'Terbatas' : 'Habis'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(produk)}
                          className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/30 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(produk.id)}
                          className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-white/70">
            Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, produkList.length)} dari {produkList.length} produk
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
                className={`px-4 py-2 text-sm font-medium rounded-xl backdrop-blur transition-all duration-200 ${currentPage === i + 1
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white bg-white/10 hover:bg-white/20'
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
    </div>
  );
}