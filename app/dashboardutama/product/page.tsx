'use client';

import Image from 'next/image';
import { FaSearch, FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  warna: string;
  foto: string;
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

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // New state for sort order
  const productsPerPage = 4;
  const [formData, setFormData] = useState({
    nama: '',
    harga: 0,
    stok: 0,
    warna: '',
    foto: '',
    deskripsi: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/product');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.nama.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // New handleSort function
  const handleSort = () => {
    const sortedData = [...filteredProducts].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(b.nama);
    });
    setFilteredProducts(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1); // Reset to page 1 after sorting
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'harga' || name === 'stok' ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add product');
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setFilteredProducts([...filteredProducts, newProduct]);
      setFormData({ nama: '', harga: 0, stok: 0, warna: '', foto: '', deskripsi: '' });
      setShowAddPopup(false);
      setCurrentPage(Math.ceil((filteredProducts.length + 1) / productsPerPage)); // Go to last page
    } catch (err) {
      alert('Error adding product');
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      nama: product.nama,
      harga: product.harga,
      stok: product.stok,
      warna: product.warna,
      foto: product.foto,
      deskripsi: product.deskripsi || '',
    });
    setShowEditPopup(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    try {
      const response = await fetch('/api/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentProduct.id, ...formData }),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      setFilteredProducts(
        filteredProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setShowEditPopup(false);
      setCurrentProduct(null);
    } catch (err) {
      alert('Error updating product');
    }
  };

  const handleDeleteClick = (product: Product) => {
    setCurrentProduct(product);
    setShowDeletePopup(true);
  };

  const handleDeleteSubmit = async () => {
    if (!currentProduct) return;
    try {
      const response = await fetch('/api/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentProduct.id }),
      });
      if (!response.ok) throw new Error('Failed to delete product');
      const newFilteredProducts = filteredProducts.filter(
        (p) => p.id !== currentProduct.id
      );
      setProducts(products.filter((p) => p.id !== currentProduct.id));
      setFilteredProducts(newFilteredProducts);
      setShowDeletePopup(false);
      setCurrentProduct(null);
      // Adjust current page if necessary
      const newTotalPages = Math.ceil(newFilteredProducts.length / productsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f4d] p-4">
      {/* Search and Add Bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 flex-1">
          {loading ? (
            <ButtonSkeleton width="90px" height="40px" />
          ) : (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg"
              onClick={handleSort} // Attach handleSort to button
            >
              <FaSort className="text-gray-600" />
              <span>Sort {sortOrder === 'asc' ? '↑' : '↓'}</span> {/* Show sort direction */}
            </button>
          )}

          <div className="relative flex-1">
            {loading ? (
              <InputSkeleton width="100%" height="40px" />
            ) : (
              <>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search Products..."
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-lg"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </>
            )}
          </div>
        </div>

        {loading ? (
          <ButtonSkeleton width="80px" height="40px" />
        ) : (
          <button
            onClick={() => setShowAddPopup(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            + Add
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-2 text-center text-white py-8">{error}</div>
          ) : currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="bg-[#242870] rounded-2xl p-6">
                <div className="flex flex-row">
                  <div className="flex items-center justify-center w-1/2">
                    <div className="relative w-32 h-32">
                      <Image
                        src={product.foto}
                        alt={product.nama}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center text-white w-1/2">
                    <h3 className="text-xl font-medium">{product.nama}</h3>
                    <p className="text-gray-300 text-sm mt-1">ID: {product.id}</p>
                    <div className="flex justify-center my-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: product.warna }}
                      ></div>
                    </div>
                    <p className="text-gray-300">Stock: {product.stok}</p>
                    <p className="text-lg font-bold">Rp {product.harga.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="w-full bg-[#c0392b] hover:bg-[#a93226] text-white py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-white py-8">No products found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                currentPage === 1
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#242870] hover:bg-[#303f9f]'
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                  currentPage === index + 1
                    ? 'bg-[#303f9f]'
                    : 'bg-[#242870] hover:bg-[#303f9f]'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                currentPage === totalPages
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#242870] hover:bg-[#303f9f]'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Product Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Price (Rp)</label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Stock</label>
                <input
                  type="number"
                  name="stok"
                  value={formData.stok}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Color</label>
                <input
                  type="text"
                  name="warna"
                  value={formData.warna}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  name="foto"
                  value={formData.foto}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPopup(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Popup */}
      {showEditPopup && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Price (Rp)</label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Stock</label>
                <input
                  type="number"
                  name="stok"
                  value={formData.stok}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Color</label>
                <input
                  type="text"
                  name="warna"
                  value={formData.warna}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  name="foto"
                  value={formData.foto}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Popup */}
      {showDeletePopup && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Product</h2>
            <p>Are you sure you want to delete {currentProduct.nama}?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;