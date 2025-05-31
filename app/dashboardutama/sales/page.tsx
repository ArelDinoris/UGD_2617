"use client";

import Image from "next/image";
import { FaSort, FaSearch, FaSave, FaEdit, FaPrint, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  nama: string;
  foto: string;
  stok?: number;
  harga: number;
  warna?: string;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

interface Transaction {
  produkId: number;
  customer: string;
  jumlah_beli: number;
  warna: string;
  total_harga: number;
  metode_bayar: string;
  total_bayar: number;
  total_kembalian: number;
  status: string;
}

const SalesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Generate a unique order ID when the component mounts
  useEffect(() => {
    const generateOrderId = () => {
      const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      return `OBZ-${dateStr}-${randomNum}`;
    };
    
    setOrderId(generateOrderId());
  }, []);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
          setError(null);
        } else {
          setError("Invalid data format from API");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calculate change amount
  const changeAmount = Math.max(0, paymentAmount - totalPrice);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Check if product is already in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        updatedCart[existingItemIndex].subtotal = 
          updatedCart[existingItemIndex].quantity * updatedCart[existingItemIndex].harga;
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, {
          ...product,
          quantity: 1,
          subtotal: product.harga
        }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update product quantity in cart
  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.harga
          };
        }
        return item;
      });
    });
  };

  // Save transaction to database
  const saveTransaction = async () => {
    try {
      if (cart.length === 0) {
        alert("Please add products to cart before saving");
        return;
      }

      if (!customerName) {
        alert("Please enter customer name");
        return;
      }

      if (paymentAmount < totalPrice) {
        alert("Payment amount must be greater than or equal to total price");
        return;
      }

      // Prepare transaction data for each cart item
      const transactions = cart.map(item => ({
        produkId: item.id,
        customer: customerName,
        jumlah_beli: item.quantity,
        warna: item.warna || "N/A",
        total_harga: item.subtotal,
        metode_bayar: paymentMethod,
        total_bayar: paymentAmount,
        total_kembalian: changeAmount,
        status: "Done"
      }));

      // Send transaction data to API
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactions),
      });

      if (!response.ok) throw new Error("Failed to save transaction");

      // Show success message and reset cart
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        // Reset form after successful transaction
        setCart([]);
        setCustomerName("");
        setPaymentAmount(0);
        setOrderId(prev => {
          const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
          const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
          return `OBZ-${dateStr}-${randomNum}`;
        });
      }, 3000);
      
    } catch (err: any) {
      alert(`Error saving transaction: ${err.message}`);
    }
  };

  // Loading Skeleton Component for a Single Product
  const ProductSkeleton = () => (
    <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl text-center shadow-lg flex flex-col items-center animate-pulse">
      <div className="relative w-32 h-32 mb-3 bg-slate-700 rounded-full"></div>
      <div className="h-6 bg-slate-700 rounded w-3/4 mt-4"></div>
      <div className="h-4 bg-slate-700 rounded w-1/2 mt-2"></div>
      <div className="h-4 bg-slate-700 rounded w-1/3 mt-2"></div>
      <div className="h-5 bg-slate-700 rounded w-2/5 mt-2"></div>
    </div>
  );

  // Loading Skeleton for Receipt
  const ReceiptSkeleton = () => (
    <div className="w-full rounded-3xl p-4 bg-white text-blue-950">
      <div className="rounded-2xl p-6 flex flex-col justify-between shadow-lg h-full animate-pulse">
        <div>
          <div className="h-8 bg-slate-200 rounded mx-auto w-1/3 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded mx-auto w-3/4 mb-1"></div>
          <div className="h-3 bg-slate-200 rounded mx-auto w-2/3 mb-4"></div>

          <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-8 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>

          <div className="space-y-3 my-4">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-12 bg-slate-200 rounded w-full"></div>
              <div className="h-12 bg-slate-200 rounded w-full"></div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="h-4 bg-slate-200 rounded w-3/5"></div>
            <div className="h-4 bg-slate-200 rounded w-2/5"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>

          <div className="h-4 bg-slate-200 rounded mx-auto w-2/3 mt-8"></div>
          <div className="h-4 bg-slate-200 rounded mx-auto w-1/2 mt-1"></div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <div className="h-10 bg-blue-300 rounded-xl"></div>
          <div className="h-10 bg-yellow-300 rounded-xl"></div>
          <div className="h-10 bg-green-300 rounded-xl"></div>
        </div>
      </div>
    </div>
  );

  // Full Page Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen p-6 font-sans space-y-6">
        {/* HEADER SKELETON */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Sort & Search Skeleton */}
          <div className="w-full md:w-2/3 rounded-3xl p-4 space-y-4 bg-[#303477] animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-10 bg-slate-200 rounded-xl w-24"></div>
              <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            </div>
          </div>

          {/* POS Title Skeleton */}
          <div className="w-full md:w-1/3 rounded-3xl p-4 flex justify-center items-center bg-white animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* MAIN CONTENT SKELETON */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Grid Skeleton */}
          <div className="w-full md:w-2/3 rounded-3xl p-6 grid grid-cols-2 gap-6 bg-[#303477]">
            {[...Array(6)].map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>

          {/* Receipt Skeleton */}
          <div className="w-full md:w-1/3">
            <ReceiptSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 font-sans text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-sans space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          Transaction saved successfully!
        </div>
      )}
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Sort & Search */}
        <div className="w-full md:w-2/3 rounded-3xl p-4 space-y-4 bg-[#303477]">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#303f9f] transition">
              <FaSort size={18} />
              <span className="text-sm">Sort</span>
            </button>

            {/* Search Bar */}
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#303477]" />
              <input
                type="text"
                placeholder="Search Bazeus Products, Headphone, Airpod, Others...."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-[#303477] placeholder-[#303477] focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* POS Title */}
        <div className="w-full md:w-1/3 rounded-3xl p-4 flex justify-center items-center bg-white">
          <div className="text-xl font-semibold text-center tracking-wider text-[#303477]">
            Point Of Sales
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Grid */}
        <div className="w-full md:w-2/3 rounded-3xl p-6 grid grid-cols-2 gap-6 bg-[#303477]">
          {filteredProducts.length === 0 ? (
            <p className="text-white text-center col-span-2">No products found.</p>
          ) : (
            filteredProducts.map((product, idx) => (
              <div
                key={product.id || idx}
                className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl text-center shadow-lg flex flex-col items-center transition hover:scale-[1.01] cursor-pointer"
                onClick={() => addToCart(product)}
              >
                <div className="relative w-32 h-32 mb-3">
                  <Image
                    src={product.foto || "/placeholder.png"}
                    alt={`${product.nama} product image`}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <p className="text-xl font-semibold mt-4 text-white">{product.nama}</p>
                <p className="text-sm text-gray-300 mt-1">ID: {product.id}</p>

                {/* Tampilkan warna produk */}
                {product.warna && (
                  <p className="text-sm text-gray-300 mt-1 flex items-center justify-center gap-2">
                    Colour: 
                    <span
                      className="w-5 h-5 rounded-full border border-gray-400"
                      style={{ backgroundColor: product.warna }}
                      title={product.warna}
                    />
                  </p>
                )}

                <p className="mt-2 text-sm text-white">
                  Stock: {product.stok ?? "N/A"}
                </p>
                <p className="text-lg font-bold mt-1 text-white">
                  Rp {product.harga.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Receipt */}
        <div className="w-full md:w-1/3 rounded-3xl p-4 bg-white text-blue-950">
          <div className="rounded-2xl p-6 flex flex-col justify-between shadow-lg h-full">
            <div>
              <h2 className="text-2xl font-bold text-center text-[#1e2a5a]">Bazeus</h2>
              <p className="text-xs text-center mb-4 leading-tight text-blue-950">
                Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok,<br />
                Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
              </p>

              <div className="text-sm leading-relaxed mb-4">
                <p><strong>Order ID:</strong> {orderId}</p>

                {/* Customer Input */}
                <div className="my-2">
                  <strong>Customer:</strong>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="ml-2 px-2 py-1 border rounded w-3/4"
                  />
                </div>
                
                <p><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                {/* Cart Items */}
                <div className="mt-2">
                  <strong>Items:</strong>
                  {cart.length === 0 ? (
                    <p className="italic text-gray-500">No items in cart</p>
                  ) : (
                    <div className="mt-1 space-y-2 max-h-44 overflow-y-auto">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-1">
                          <div>
                            <div className="flex items-center">
                              <span className="mr-2">x{item.quantity}</span>
                              <span>{item.nama} - {item.warna || "N/A"}</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              @ Rp {item.harga.toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.id, -1);
                              }}
                              className="p-1 bg-gray-200 rounded-full"
                            >
                              <FaMinus size={10} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.id, 1);
                              }}
                              className="p-1 bg-gray-200 rounded-full"
                            >
                              <FaPlus size={10} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id);
                              }}
                              className="p-1 bg-red-100 rounded-full text-red-600"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                <p className="mt-2 font-bold">
                  <strong>Total:</strong> Rp {totalPrice.toLocaleString()}
                </p>

                {/* Payment Method */}
                <p className="mt-2"><strong>Payment Method:</strong></p>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === "QRIS"}
                      onChange={() => setPaymentMethod("QRIS")}
                      className="accent-black" 
                    /> 
                    QRIS
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === "Cash"}
                      onChange={() => setPaymentMethod("Cash")}
                      className="accent-gray-300" 
                    /> 
                    Cash
                  </label>
                </div>

                {/* Payment Input */}
                <div className="mt-2">
                  <strong>Payment:</strong>
                  <input
                    type="number"
                    value={paymentAmount || ""}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    placeholder="Enter payment amount"
                    className="ml-2 px-2 py-1 border rounded w-1/2"
                  />
                </div>

                <p><strong>Return:</strong> Rp {changeAmount.toLocaleString()}</p>
              </div>

              <p className="text-center text-sm mt-4 text-blue-950">
                Thank you for shopping at <strong>Bazeus</strong><br />
                Your satisfaction is our satisfaction too.
              </p>
            </div>

            {/* BUTTONS WITH ICONS */}
            <div className="flex flex-col gap-3 mt-6">
              <button 
                className="bg-[#1a56db] hover:bg-[#174bc2] text-white font-bold py-2 rounded-xl text-lg flex items-center justify-center gap-2"
                onClick={saveTransaction}
              >
                <FaSave size={18} />
                Save
              </button>
              <button className="bg-[#f5a623] hover:bg-[#d98d1c] text-white font-bold py-2 rounded-xl text-lg flex items-center justify-center gap-2">
                <FaEdit size={18} />
                Edit
              </button>
              <button className="bg-[#28c76f] hover:bg-[#20a35a] text-white font-bold py-2 rounded-xl text-lg flex items-center justify-center gap-2">
                <FaPrint size={18} />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;