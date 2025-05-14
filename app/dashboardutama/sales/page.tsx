'use client';
import Image from 'next/image';
import { FaSort, FaSearch, FaSave, FaEdit, FaPrint } from 'react-icons/fa';

const products = [
  { name: 'Headphone', image: '/headphone.png', stock: 10, price: 500000 },
  { name: 'Airpod', image: '/airbuds.png', stock: 10, price: 500000 },
  { name: 'Headset', image: '/earphone.png', stock: 10, price: 500000 },
  { name: 'Accessories', image: '/airpods.png', stock: 10, price: 500000 },
];

const SalesPage = () => {
  return (
    <div className="min-h-screen p-6 font-sans space-y-6">
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
          {products.map((product, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl text-center shadow-lg flex flex-col items-center transition hover:scale-[1.01]"
            >
              <Image
                src={product.image}
                alt={`${product.name} product image`}
                width={130}
                height={130}
                className="mb-3"
              />
              <p
                className={`text-xl font-semibold mt-4 ${product.stock === 10 && product.price === 500000 ? 'text-white' : ''}`}
              >
                {product.name}
              </p>
              <div className="flex justify-center gap-2 mt-2 items-center">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#1e2a5a]" />
                <div className="w-3 h-3 rounded-full bg-[#303477] border-2 border-white" />
              </div>
              <p
                className={`mt-2 text-sm ${product.stock === 10 && product.price === 500000 ? 'text-white' : ''}`}
              >
                Stock: {product.stock}
              </p>
              <p
                className={`text-lg font-bold mt-1 ${product.stock === 10 && product.price === 500000 ? 'text-white' : ''}`}
              >
                Rp {product.price.toLocaleString()}
              </p>
            </div>
          ))}
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
                <p><strong>Order ID:</strong> OBZ-001</p>
                <p><strong>Product ID:</strong> ABZ-001</p>
                <p><strong>Customer:</strong> Arel Dinoris</p>
                <p><strong>Date:</strong> Monday, April 1, 2025</p>
                <p className="mt-2"><strong>Pembelian:</strong><br />x1 Airpod - White</p>
                <p className="mt-2"><strong>Total:</strong> Rp 500.000</p>

                <p className="mt-2"><strong>Payment Method:</strong></p>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="accent-black" /> QRIS
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="payment" className="accent-gray-300" /> Cash
                  </label>
                </div>

                <p className="mt-2"><strong>Payment:</strong> Rp 500.000</p>
                <p><strong>Return:</strong> Rp 0</p>
              </div>

              <p className="text-center text-sm mt-4 text-blue-950">
                Thank you for shopping at <strong>Bazeus</strong><br />
                Your satisfaction is our satisfaction too.
              </p>
            </div>

            {/* BUTTONS WITH ICONS */}
            <div className="flex flex-col gap-3 mt-6">
              <button className="bg-[#1a56db] hover:bg-[#174bc2] text-white font-bold py-2 rounded-xl text-lg flex items-center justify-center gap-2">
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