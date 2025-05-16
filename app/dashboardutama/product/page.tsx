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
  // Make deskripsi optional since it's not in your API response
  deskripsi?: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch products data from API
    setLoading(true);
    fetch('/api/product')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then(data => {
        console.log('Products data:', data); // Debug log
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (product: Product) => {
    setCurrentProduct(product);
    setShowDeletePopup(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f4d] p-4 flex items-center justify-center">
        <p className="text-white text-xl">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1f4d] p-4 flex items-center justify-center">
        <p className="text-white text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f4d] p-4">
      {/* Search and Add Bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg">
            <FaSort className="text-gray-600" />
            <span>Sort</span>
          </button>
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search Products..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAddPopup(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          + Add
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
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
          <div className="col-span-2 text-center text-white py-8">
            No products found.
          </div>
        )}
      </div>

      {/* Add Product Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            {/* Add form implementation here */}
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setShowAddPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Popup */}
      {showEditPopup && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            {/* Edit form implementation here */}
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setShowEditPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
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
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
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