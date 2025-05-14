'use client';

import { useState } from 'react';
import { FaSort, FaSearch, FaPen, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Generate sample sales detail data
const initialSalesDetailData = [
  { date: 'April 1, 2025', orderId: 'OBZ-001', productId: 'ABZ-001', customer: 'Arel Dinoris', product: 'Airpod', total: 'Rp 500.000', method: 'QRIS', status: 'Done' },
  { date: 'April 2, 2025', orderId: 'OBZ-002', productId: 'ABZ-002', customer: 'John Doe', product: 'Headphone', total: 'Rp 500.000', method: 'Cash', status: 'Pending' },
];

export default function SalesDetailPage() {
  const [salesDetailData, setSalesDetailData] = useState(initialSalesDetailData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    orderId: '',
    productId: '',
    customer: '',
    product: '',
    total: '',
    method: '',
    status: ''
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Handle sorting by Order ID
  const handleSort = () => {
    const sortedData = [...salesDetailData].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.orderId.localeCompare(b.orderId)
        : b.orderId.localeCompare(a.orderId);
    });
    setSalesDetailData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Handle search functionality
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter data based on search query
  const filteredData = salesDetailData.filter(item =>
    item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Add/Edit action
  const handleFormSubmit = () => {
    if (modalMode === 'add') {
      setSalesDetailData(prev => [...prev, formData]);
    } else if (modalMode === 'edit') {
      const updatedData = salesDetailData.map(item =>
        selectedItems.includes(item.orderId) ? { ...item, ...formData } : item
      );
      setSalesDetailData(updatedData);
    }
    closeModal();
  };

  // Open modal for Add, Edit, or Delete
  const openModal = (mode: 'add' | 'edit' | 'delete', data: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && selectedItems.length === 1) {
      const selectedItem = salesDetailData.find(item => item.orderId === selectedItems[0]);
      if (selectedItem) {
        setFormData(selectedItem);
      }
    } else {
      setFormData({
        date: '',
        orderId: '',
        productId: '',
        customer: '',
        product: '',
        total: '',
        method: '',
        status: ''
      });
    }
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle Delete action
  const handleDelete = () => {
    setSalesDetailData(prev => prev.filter(item => !selectedItems.includes(item.orderId)));
    closeModal();
  };

  // Handle checkbox selection
  const handleCheckboxChange = (orderId: string) => {
    setSelectedItems(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  // Render the status icons
  const renderStatusIcon = (status: string) => {
    if (status === 'Done') {
      return <FaCheckCircle className="text-green-500" />;
    } else if (status === 'Pending') {
      return <FaExclamationCircle className="text-orange-500" />;
    }
    return null;
  };

  return (
    <div className="bg-[#1E1A4E] min-h-screen text-white">
      {/* Header with search and action buttons */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Sort Button */}
        <button className="flex items-center gap-2 border border-gray-400 px-3 py-1 h-9 rounded-md text-sm" onClick={handleSort}>
          <FaSort className="text-white text-sm" />
          <span>Sort</span>
        </button>

        {/* Search bar & Action buttons */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Bazeus Products, Headphone, Airpod, Others...."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-white text-black pl-10 pr-4 py-2 h-9 rounded-full w-[700px] text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          </div>

          {/* Action Buttons */}
          <button className="bg-green-500 hover:bg-green-600 text-white px-20 h-9 rounded-md flex items-center gap-1 text-sm font-semibold" onClick={() => openModal('add')}>
            <span className="text-base">+</span> Add
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-20 h-9 rounded-md flex items-center gap-1 text-sm font-semibold" onClick={() => openModal('edit')} disabled={selectedItems.length !== 1}>
            <FaPen className="text-sm" /> Edit
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-20 h-9 rounded-md flex items-center gap-1 text-sm font-semibold" onClick={() => openModal('delete')} disabled={selectedItems.length === 0}>
            <FaTrash className="text-sm" /> Delete
          </button>
        </div>
      </div>

      {/* Table container */}
      <div className="px-4 pb-4">
        <div className="bg-[#2A256A] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="p-4">Select</th>
                <th className="p-4">Date</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Product ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Total</th>
                <th className="p-4">Method Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td className="p-4 border-none">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.orderId)}
                      onChange={() => handleCheckboxChange(item.orderId)}
                      className="form-checkbox"
                    />
                  </td>
                  <td className="p-4 border-b border-gray-700">{item.date}</td>
                  <td className="p-4 border-b border-gray-700">{item.orderId}</td>
                  <td className="p-4 border-b border-gray-700">{item.productId}</td>
                  <td className="p-4 border-b border-gray-700">{item.customer}</td>
                  <td className="p-4 border-b border-gray-700">{item.product}</td>
                  <td className="p-4 border-b border-gray-700">{item.total}</td>
                  <td className="p-4 border-b border-gray-700">{item.method}</td>
                  <td className="p-4 border-b border-gray-700 flex items-center gap-2">
                    {renderStatusIcon(item.status)}
                    <span>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit/Delete */}
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-[600px] text-black">
            <h2 className="text-lg font-semibold mb-4">
              {modalMode === 'add' && 'Add Sale'}
              {modalMode === 'edit' && 'Edit Sale'}
              {modalMode === 'delete' && 'Delete Confirmation'}
            </h2>

            {/* Add/Edit Form */}
            {modalMode !== 'delete' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Date</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
                <label className="block text-sm font-semibold mb-2">Order ID</label>
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
                <label className="block text-sm font-semibold mb-2">Product ID</label>
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
                <label className="block text-sm font-semibold mb-2">Customer</label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
                <label className="block text-sm font-semibold mb-2">Product</label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
                <label className="block text-sm font-semibold mb-2">Total</label>
                <input
                  type="text"
                  name="total"
                  value={formData.total}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
                <label className="block text-sm font-semibold mb-2">Method</label>
                <input
                  type="text"
                  name="method"
                  value={formData.method}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
                <label className="block text-sm font-semibold mb-2">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between">
              {modalMode === 'delete' ? (
                <div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}