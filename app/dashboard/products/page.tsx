'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { inter } from '@/app/ui/fonts';

interface Product {
  id: number;
  nama: string;
  harga: number;
  foto: string;
  deskripsi?: string;
  stok?: number;
  warna?: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const productsPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/product')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSeeMore = async (productId: number) => {
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const response = await fetch(`/api/product/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product detail');
      const productDetail = await response.json();
      setSelectedProduct(productDetail);
    } catch (error) {
      console.error('Error fetching product detail:', error);
      setSelectedProduct(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const backgroundImages = [
    { src: '/headphone.png', className: 'top-10 left-10 rotate-12' },
    { src: '/airbuds.png', className: 'bottom-10 left-10 -rotate-12' },
    { src: '/earphone.png', className: 'top-10 right-10 -rotate-12' },
    { src: '/airpods.png', className: 'bottom-10 right-10 rotate-12' },
  ];

  return (
    <>
      <div className="relative p-4 text-center min-h-screen text-white overflow-hidden">
        {/* Background images */}
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute ${img.className} w-[500px] h-[500px] z-0 drop-shadow-[0_20px_25px_rgba(0,0,0,1)]`}
          >
            <Image
              src={img.src}
              alt="Background product"
              fill
              className="object-contain"
            />
          </div>
        ))}

        {/* Header Section */}
        <div className="relative z-10 pt-8 pb-16">
          <h1 className={`${inter.className} text-5xl font-bold text-white mb-4`}>
            Our products will guarantee your satisfaction.
          </h1>
          <p className={`${inter.className} text-xl text-white text-opacity-90 mx-auto leading-relaxed`}>
            Our products are guaranteed authentic and come with a warranty, ensuring quality, reliability, and peace of mind with every purchase.
          </p>
        </div>

        {/* Main Content with Pagination */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Left Pagination Button */}
          <div className="flex-shrink-0 mr-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-12 h-12 flex items-center justify-center text-xl font-bold"
            >
              ←
            </button>
          </div>

          {/* Product Grid - 4 columns horizontal */}
          <div className="flex-grow max-w-8xl">
            <div className="grid grid-cols-4 gap-12">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="relative bg-[#242870] border border-white border-opacity-20 rounded-3xl p-10 animate-pulse"
                  >
                    <div className="flex items-center justify-center w-full">
                      <div className="w-56 h-56 bg-gray-600 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="col-span-4 text-center text-white py-12 text-xl">{error}</div>
              ) : currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative bg-[#242870] border border-white border-opacity-20 rounded-3xl p-10 text-white text-center shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  >
                    {/* Inner container with transparent background */}
                    <div className="rounded-2xl p-6 bg-white bg-opacity-10">
                      <div className="mb-6 flex justify-center items-center">
                        <div className="relative w-56 h-56">
                          <Image
                            src={product.foto}
                            alt={product.nama}
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </div>
                      <h3 className={`${inter.className} text-2xl font-medium text-white`}>{product.nama}</h3>
                      <p className={`${inter.className} text-xl font-bold mt-4 text-white`}>
                        Rp {product.harga.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleSeeMore(product.id)}
                        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 px-7 rounded-full text-base font-medium transition-colors duration-200"
                      >
                        See More
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center text-white py-12 text-xl">No products found.</div>
              )}
            </div>
          </div>

          {/* Right Pagination Button */}
          <div className="flex-shrink-0 ml-8">
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-12 h-12 flex items-center justify-center text-xl font-bold"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Product Detail */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#242870] border border-white border-opacity-20 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>

            {modalLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Loading product details...</p>
              </div>
            ) : selectedProduct ? (
              <div className="text-white">
                {/* Product Image */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-80 h-80">
                    <Image
                      src={selectedProduct.foto}
                      alt={selectedProduct.nama}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="text-center mb-6">
                  <h2 className={`${inter.className} text-4xl font-bold mb-4`}>{selectedProduct.nama}</h2>
                  <p className={`${inter.className} text-3xl font-bold text-blue-300 mb-4`}>
                    Rp {selectedProduct.harga.toLocaleString()}
                  </p>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-10 rounded-xl p-4">
                    <h3 className={`${inter.className} text-xl font-semibold mb-2`}>Deskripsi</h3>
                    <p className={`${inter.className} text-lg text-gray-200 leading-relaxed`}>
                      {selectedProduct.deskripsi || 'No description available'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.stok !== undefined && (
                      <div className="bg-white bg-opacity-10 rounded-xl p-4">
                        <h3 className={`${inter.className} text-lg font-semibold mb-1`}>Stok</h3>
                        <p
                          className={`${inter.className} text-xl font-bold ${
                            selectedProduct.stok > 0 ? 'text-green-300' : 'text-red-300'
                          }`}
                        >
                          {selectedProduct.stok} unit
                        </p>
                      </div>
                    )}
                    {selectedProduct.warna && (
                      <div className="bg-white bg-opacity-10 rounded-xl p-4">
                        <h3 className={`${inter.className} text-lg font-semibold mb-1`}>Warna</h3>
                        <p className={`${inter.className} text-xl text-gray-200`}>{selectedProduct.warna}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 justify-center">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full text-lg font-medium transition-colors duration-200 max-w-xs">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg font-medium transition-colors duration-200 max-w-xs">
                    Buy Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white text-xl">Failed to load product details</p>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;