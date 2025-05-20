'use client';

import { useState, useEffect } from 'react';
import { FaSort, FaSearch, FaPen, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface TransactionData {
  id: number;
  date: string;
  orderId: string;
  productId: number;
  productName: string;
  customer: string;
  quantity: number;
  total: number;
  method: string;
  status: string;
}

const TransactionSkeleton = () => {
  return (
    <tr className="animate-pulse">
      <td className="p-4 border-b border-gray-700">
        <div className="w-4 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700">
        <div className="w-24 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700">
        <div className="w-16 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700">
        <div className="w-12 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700">
        <div className="w-20 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700">
        <div className="w-24 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700">
        <div className="w-12 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700">
        <div className="w-20 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700">
        <div className="w-16 h-4 bg-gray-600 rounded" />
      </td>
      <td className="p-4 border-b border-gray-700 flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-600 rounded-full" />
        <div className="w-16 h-4 bg-gray-600 rounded" />
      </td>
    </tr>
  );
};

export default function SalesDetailPage() {
  const [salesDetailData, setSalesDetailData] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [formData, setFormData] = useState<TransactionData>({
    id: 0,
    date: '',
    orderId: '',
    productId: 0,
    productName: '',
    customer: '',
    quantity: 0,
    total: 0,
    method: '',
    status: ''
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [products, setProducts] = useState<{ id: number, nama: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('/api/transaction');
        if (!res.ok) throw new Error('Failed to fetch transactions');
        const data = await res.json();
        const productRes = await fetch('/api/product');
        if (!productRes.ok) throw new Error('Failed to fetch products');
        const productData = await productRes.json();
        if (Array.isArray(productData)) {
          setProducts(productData.map(p => ({ id: p.id, nama: p.nama })));
        }
        if (Array.isArray(data)) {
          const formattedData: TransactionData[] = data.map(item => ({
            id: item.id,
            date: new Date(item.tanggal).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            orderId: `OBZ-${item.id.toString().padStart(3, '0')}`,
            productId: item.produkId,
            productName: item.produk.nama,
            customer: item.customer,
            quantity: item.jumlah_beli,
            total: item.total_harga,
            method: item.metode_bayar,
            status: item.status
          }));
          setSalesDetailData(formattedData);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        alert('Failed to load transaction data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSort = () => {
    const sortedData = [...salesDetailData].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.orderId.localeCompare(b.orderId)
        : b.orderId.localeCompare(b.orderId);
    });
    setSalesDetailData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = salesDetailData.filter(item =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'productId' || name === 'quantity' || name === 'total' ? Number(value) : value
    }));
  };

  const handleFormSubmit = async () => {
    try {
      if (modalMode === 'add') {
        const response = await fetch('/api/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{
            produkId: formData.productId,
            customer: formData.customer,
            jumlah_beli: formData.quantity,
            warna: '',
            total_harga: formData.total,
            metode_bayar: formData.method,
            total_bayar: formData.total,
            total_kembalian: 0,
            status: formData.status
          }]),
        });
        if (!response.ok) throw new Error('Failed to add transaction');
        const newId = Date.now();
        setSalesDetailData(prev => [
          ...prev,
          {
            ...formData,
            id: newId,
            orderId: `OBZ-${newId.toString().slice(-3).padStart(3, '0')}`,
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }
        ]);
      } else if (modalMode === 'edit') {
        const response = await fetch(`/api/transaction/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            produkId: formData.productId,
            customer: formData.customer,
            jumlah_beli: formData.quantity,
            total_harga: formData.total,
            metode_bayar: formData.method,
            status: formData.status
          }),
        });
        if (!response.ok) throw new Error('Failed to update transaction');
        setSalesDetailData(prev =>
          prev.map(item =>
            item.id === formData.id ? formData : item
          )
        );
      }
      closeModal();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const openModal = (mode: 'add' | 'edit' | 'delete') => {
    setModalMode(mode);
    if (mode === 'edit' && selectedItems.length === 1) {
      const selectedItem = salesDetailData.find(item => item.id === selectedItems[0]);
      if (selectedItem) {
        setFormData(selectedItem);
      }
    } else if (mode === 'add') {
      setFormData({
        id: 0,
        date: '',
        orderId: '',
        productId: products.length > 0 ? products[0].id : 0,
        productName: '',
        customer: '',
        quantity: 1,
        total: 0,
        method: 'QRIS',
        status: 'Pending'
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      for (const id of selectedItems) {
        const response = await fetch(`/api/transaction/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete transaction ${id}`);
      }
      setSalesDetailData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      closeModal();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
      <div className="flex items-center gap-3 px-4 py-3">
        {loading ? (
          <div className="flex items-center gap-2 w-full animate-pulse">
            <div className="h-9 w-24 bg-gray-600 rounded-md" />
            <div className="relative flex-1">
              <div className="h-9 w-full bg-gray-600 rounded-full" />
            </div>
            <div className="h-9 w-32 bg-gray-600 rounded-md" />
            <div className="h-9 w-32 bg-gray-600 rounded-md" />
            <div className="h-9 w-32 bg-gray-600 rounded-md" />
          </div>
        ) : (
          <>
            <button className="flex items-center gap-2 border border-gray-400 px-3 py-1 h-9 rounded-md text-sm" onClick={handleSort}>
              <FaSort className="text-white text-sm" />
              <span>Sort {sortOrder === 'asc' ? '↑' : '↓'}</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by customer, product, or order ID..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-white text-black pl-10 pr-4 py-2 h-9 rounded-full w-[700px] text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
              </div>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-20 h-9 rounded-md flex items-center gap-1 text-sm font-semibold"
                onClick={() => openModal('add')}
              >
                <span className="text-base">+</span> Add
              </button>
              <button
                className={`bg-orange-500 hover:bg-orange-600 text-white px-20 h-9 rounded-md flex items-center gap-1 text-sm font-semibold ${selectedItems.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => selectedItems.length === 1 && openModal('edit')}
                disabled={selectedItems.length !== 1}
              >
                <FaPen className="text-sm" /> Edit
              </button>
              <button
                className={`bg-red-600 hover:bg-red-700 text-white px-20 h-9 rounded-md flex items-center gap-1 text-sm font-semibold ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => selectedItems.length > 0 && openModal('delete')}
                disabled={selectedItems.length === 0}
              >
                <FaTrash className="text-sm" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
      <div className="px-4 pb-4">
        <div className="bg-[#2A256A] rounded-lg overflow-hidden">
          {loading ? (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-4"><div className="w-12 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                  <th className="p-4"><div className="w-20 h-4 bg-gray-600 rounded" /></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TransactionSkeleton key={index} />
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-4">Select</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Method Payment</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-4 text-center">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="p-4 border-none">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          className="form-checkbox"
                        />
                      </td>
                      <td className="p-4 border-b border-gray-700">{item.date}</td>
                      <td className="p-4 border-b border-gray-700">{item.orderId}</td>
                      <td className="p-4 border-b border-gray-700">{item.productId}</td>
                      <td className="p-4 border-b border-gray-700">{item.customer}</td>
                      <td className="p-4 border-b border-gray-700">{item.productName}</td>
                      <td className="p-4 border-b border-gray-700">{item.quantity}</td>
                      <td className="p-4 border-b border-gray-700">Rp {item.total.toLocaleString()}</td>
                      <td className="p-4 border-b border-gray-700">{item.method}</td>
                      <td className="p-4 border-b border-gray-700 flex items-center gap-2">
                        {renderStatusIcon(item.status)}
                        <span>{item.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-[600px] text-black">
            <h2 className="text-lg font-semibold mb-4">
              {modalMode === 'add' && 'Add Sale'}
              {modalMode === 'edit' && 'Edit Sale'}
              {modalMode === 'delete' && 'Delete Confirmation'}
            </h2>
            {modalMode !== 'delete' && (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Customer</label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleFormChange}
                    className="border p-2 w-full rounded-md"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Product</label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleFormChange}
                    className="border p-2 w-full rounded-md"
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.nama} (ID: {product.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    min="1"
                    className="border p-2 w-full rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Total Price</label>
                  <input
                    type="number"
                    name="total"
                    value={formData.total}
                    onChange={handleFormChange}
                    min="0"
                    className="border p-2 w-full rounded-md"
                    placeholder="Price in Rupiah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Payment Method</label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleFormChange}
                    className="border p-2 w-full rounded-md"
                  >
                    <option value="QRIS">QRIS</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="border p-2 w-full rounded-md"
                  >
                    <option value="Done">Done</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            )}
            {modalMode === 'delete' && (
              <div className="mb-4">
                <p>Are you sure you want to delete {selectedItems.length > 1 ? 'these transactions' : 'this transaction'}?</p>
                <p className="text-red-500 text-sm mt-2">This action cannot be undone.</p>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              {modalMode === 'delete' ? (
                <>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}