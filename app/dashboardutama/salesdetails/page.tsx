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
      <td className="p-4 border-b border-gray-700">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded" />
          <div className="w-8 h-8 bg-gray-600 rounded" />
        </div>
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
  const [itemToDelete, setItemToDelete] = useState<TransactionData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('/api/transaction');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch transactions');
        }
        const data = await res.json();
        const productRes = await fetch('/api/product');
        if (!productRes.ok) {
          const errorData = await productRes.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        const productData = await productRes.json();
        if (Array.isArray(productData)) {
          setProducts(productData.map(p => ({ id: p.id, nama: p.nama })));
        } else {
          throw new Error('Invalid product data format');
        }
        if (Array.isArray(data)) {
          const formattedData: TransactionData[] = data.map(item => ({
            id: item.id || 0,
            date: item.tanggal ? new Date(item.tanggal).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Invalid Date',
            orderId: item.orderId || `OBZ-${(item.id || 0).toString().padStart(3, '0')}`,
            productId: item.produkId || 0,
            productName: item.produk?.nama || 'Unknown Product',
            customer: item.customer || 'Unknown Customer',
            quantity: item.jumlah_beli || 0,
            total: item.total_harga || 0,
            method: item.metode_bayar || 'Unknown Method',
            status: item.status || 'Unknown Status'
          }));
          setSalesDetailData(formattedData);
        } else {
          throw new Error('Invalid transaction data format');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        alert(`Failed to load data: ${err.message}`);
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
        : b.orderId.localeCompare(a.orderId);
    });
    setSalesDetailData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = salesDetailData.filter(item => {
    if (!searchQuery || searchQuery.trim() === '') {
      return true;
    }
    const query = searchQuery.toLowerCase().trim();
    return (
      (item.date?.toLowerCase() || '').includes(query) ||
      (item.orderId?.toLowerCase() || '').includes(query) ||
      item.productId?.toString().includes(query) ||
      (item.customer?.toLowerCase() || '').includes(query) ||
      (item.productName?.toLowerCase() || '').includes(query) ||
      item.quantity?.toString().includes(query) ||
      item.total?.toString().includes(query) ||
      (item.method?.toLowerCase() || '').includes(query) ||
      (item.status?.toLowerCase() || '').includes(query)
    );
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: name === 'productId' || name === 'quantity' || name === 'total' ? Number(value) : value
      };
      if (name === 'productId') {
        const selectedProduct = products.find(p => p.id === Number(value));
        newFormData.productName = selectedProduct ? selectedProduct.nama : prev.productName;
      }
      return newFormData;
    });
  };

  const handleFormSubmit = async () => {
    // Validation
    if (!formData.customer.trim()) {
      alert('Customer name is required');
      return;
    }
    if (formData.productId === 0) {
      alert('Please select a product');
      return;
    }
    if (formData.quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }
    if (formData.total < 0) {
      alert('Total price cannot be negative');
      return;
    }
    if (!formData.method) {
      alert('Please select a payment method');
      return;
    }
    if (!formData.status) {
      alert('Please select a status');
      return;
    }

    try {
      if (modalMode === 'add') {
        const payload = [{
          produkId: formData.productId,
          customer: formData.customer,
          jumlah_beli: formData.quantity,
          warna: 'N/A',
          total_harga: formData.total,
          metode_bayar: formData.method,
          total_bayar: formData.total,
          total_kembalian: 0,
          status: formData.status,
          orderId: `OBZ-${Date.now().toString().slice(-3).padStart(3, '0')}`,
          tanggal: new Date().toISOString()
        }];
        console.log('Add payload:', payload);
        const response = await fetch('/api/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.error || 'Failed to add transaction');
        }
        const newTransaction = await response.json();
        const newId = newTransaction[0].id;
        setSalesDetailData(prev => [
          ...prev,
          {
            ...formData,
            id: newId,
            orderId: newTransaction[0].orderId,
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            productName: products.find(p => p.id === formData.productId)?.nama || formData.productName
          }
        ]);
        alert('Transaction added successfully!');
      } else if (modalMode === 'edit') {
        const payload = {
          id: formData.id,
          produkId: formData.productId,
          customer: formData.customer,
          jumlah_beli: formData.quantity,
          warna: 'N/A',
          total_harga: formData.total,
          metode_bayar: formData.method,
          total_bayar: formData.total,
          total_kembalian: 0,
          status: formData.status,
          orderId: formData.orderId,
          tanggal: new Date().toISOString()
        };
        console.log('Edit payload:', payload);
        const response = await fetch(`/api/transaction/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.error || `Failed to update transaction (Status: ${response.status})`);
        }
        const updatedTransaction = await response.json();
        setSalesDetailData(prev =>
          prev.map(item =>
            item.id === formData.id
              ? {
                  ...formData,
                  date: new Date(updatedTransaction.tanggal).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }),
                  productName: updatedTransaction.produk?.nama || formData.productName
                }
              : item
          )
        );
        alert('Transaction updated successfully!');
      }
      closeModal();
    } catch (err: any) {
      console.error(`Error during ${modalMode} operation:`, err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      console.log(`Deleting transaction ID: ${itemToDelete.id}`);
      const response = await fetch(`/api/transaction/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `Failed to delete transaction (Status: ${response.status})`);
      }
      setSalesDetailData(prev => prev.filter(item => item.id !== itemToDelete.id));
      closeModal();
      alert('Transaction deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting transaction:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const openModal = (mode: 'add' | 'edit' | 'delete', item?: TransactionData) => {
    console.log(`Opening modal in ${mode} mode`, item);
    setModalMode(mode);
    if (mode === 'add') {
      setFormData({
        id: 0,
        date: '',
        orderId: '',
        productId: products.length > 0 ? products[0].id : 0,
        productName: products.length > 0 ? products[0].nama : '',
        customer: '',
        quantity: 1,
        total: 0,
        method: 'QRIS',
        status: 'Pending'
      });
    } else if (mode === 'edit' && item) {
      setFormData({
        ...item,
        productId: item.productId || (products.length > 0 ? products[0].id : 0),
        productName: products.find(p => p.id === (item.productId || 0))?.nama || item.productName || ''
      });
    } else if (mode === 'delete' && item) {
      setItemToDelete(item);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setModalOpen(false);
    setModalMode(null);
    setItemToDelete(null);
    setFormData({
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
  };

  const handleCheckboxChange = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectedItems(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
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
                  placeholder="Search by date, order ID, product, customer, quantity, total, method, or status..."
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
            </div>
          </>
        )}
      </div>

      {/* Search Results Info */}
      {!loading && searchQuery && (
        <div className="px-4 pb-2">
          <p className="text-sm text-gray-300">
            Found {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        </div>
      )}

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
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-4 text-center">
                      {searchQuery ? `No transactions found matching "${searchQuery}"` : "No transactions found."}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="p-4 border-none">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => handleCheckboxChange(item.id, e)}
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
                      <td className="p-4 border-b border-gray-700">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('edit', item)}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md transition-colors duration-200"
                            title="Edit transaction"
                          >
                            <FaPen className="text-sm" />
                          </button>
                          <button
                            onClick={() => openModal('delete', item)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors duration-200"
                            title="Delete transaction"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-[600px] text-black">
            <h2 className="text-lg font-semibold mb-4">
              {modalMode === 'add' ? 'Add Sale' : 'Edit Sale'}
            </h2>
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
                  {products.length === 0 ? (
                    <option value={0}>No products available</option>
                  ) : (
                    products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.nama} (ID: {product.id})
                      </option>
                    ))
                  )}
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
            <div className="flex justify-end gap-2 mt-6">
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
                {modalMode === 'add' ? 'Save' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalOpen && modalMode === 'delete' && itemToDelete && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-[500px] text-black">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Delete Transaction</h2>
            <p className="mb-6">
              Are you sure you want to delete this transaction?
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Order ID:</strong> {itemToDelete.orderId}</div>
                <div><strong>Customer:</strong> {itemToDelete.customer}</div>
                <div><strong>Product:</strong> {itemToDelete.productName}</div>
                <div><strong>Total:</strong> Rp {itemToDelete.total.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}