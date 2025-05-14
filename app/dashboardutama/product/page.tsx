'use client';
import Image from 'next/image';
import { FaSearch, FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
  colour: string; 
  stock: number;
  price: number;
}

const ProductPage = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const products: Product[] = [
    { id: 'ABZ-001', name: 'Airpod', image: '/airbuds.png', colour: 'white', stock: 10, price: 500000 },
    { id: 'HBZ-001', name: 'Headphone', image: '/headphone.png', colour: 'black', stock: 10, price: 500000 },
    { id: 'HDBZ-001', name: 'Headset', image: '/earphone.png', colour: 'blue', stock: 10, price: 200000 },
    { id: 'ACBZ-001', name: 'Accessories', image: '/airpods.png', colour: 'white', stock: 10, price: 50000 },
  ];

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (product: Product) => {
    setCurrentProduct(product);
    setShowDeletePopup(true);
  };

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
              placeholder="Search Bazeus Products, Headphone, Airpod, Others...."
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
        {products.map((product) => (
          <div key={product.id} className="bg-[#242870] rounded-2xl p-6">
            <div className="flex flex-row">
              <div className="flex items-center justify-center w-1/2">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-end justify-center text-white w-1/2">
                <h3 className="text-xl font-medium">{product.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{product.id}</p>
                <div className="flex justify-center my-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-300">Stock: {product.stock}</p>
                <p className="text-lg font-bold">Rp {product.price.toLocaleString()}</p>
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
        ))}
      </div>

      {/* Add Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-medium mb-4">Add Product</h3>
            <input
              type="file"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Product Name"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Product Code"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Colour"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Stock"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => setShowAddPopup(false)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg w-full"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddPopup(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg w-full mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {showEditPopup && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-medium mb-4">Edit Product</h3>
            <input
              type="file"
              accept="image/jpeg,image/jpg"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              defaultValue={currentProduct.name}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              defaultValue={currentProduct.id}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              defaultValue={currentProduct.colour}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              defaultValue={currentProduct.stock.toString()}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              defaultValue={currentProduct.price.toString()}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => setShowEditPopup(false)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg w-full"
            >
              Save
            </button>
            <button
              onClick={() => setShowEditPopup(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg w-full mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {showDeletePopup && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-medium mb-4">Delete Product</h3>
            <p>Are you sure you want to delete {currentProduct.name}?</p>
            <button
              onClick={() => setShowDeletePopup(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg w-full mt-4"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeletePopup(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg w-full mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
