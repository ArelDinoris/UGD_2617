'use client';

import { inter } from '@/app/ui/fonts';
import Image from 'next/image';
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

const backgroundImages = [
  { src: "/headphone.png", className: "top-10 left-10 rotate-12" },
  { src: "/airbuds.png", className: "bottom-10 left-10 -rotate-12" },
  { src: "/earphone.png", className: "top-10 right-10 -rotate-12" },
  { src: "/airpods.png", className: "bottom-10 right-10 rotate-12" },
];

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/product')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        const colorDefaults: Record<number, string> = {};
        data.forEach((prod: Product) => {
          const warna = prod.warna.split(',')[0];
          colorDefaults[prod.id] = warna;
        });
        setSelectedColors(colorDefaults);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Gagal memuat produk');
        setLoading(false);
      });
  }, []);

  const handleColorSelect = (productId: number, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative p-4 text-center min-h-screen text-white overflow-visible">
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

      <div className="relative z-10">
        <h2 className={`${inter.className} text-5xl font-bold text-white`}>
          Our Products Will Guarantee Your Satisfaction.
        </h2>
        <p className={`${inter.className} mt-2 text-3xl mx-auto`}>
          Our Products Are Guaranteed Authentic And Come With A Warranty, Ensuring Quality, Reliability, And Peace Of Mind With Every Purchase.
        </p>
        
        <div className='flex justify-center'>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 w-full">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col h-full">
                <div className="flex-grow bg-[#303477] border border-white border-opacity-20 rounded-lg p-6">
                  <div className="h-full flex flex-col">
                    <div className="flex-grow mb-6 p-4 bg-white bg-opacity-10 rounded-2xl flex flex-col items-center">
                      <div className="relative aspect-square w-full max-w-[250px] flex-grow">
                        <Image 
                          src={product.foto} 
                          alt={product.nama} 
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      
                      <h3 className={`${inter.className} text-2xl font-semibold text-white mt-4`}>
                        {product.nama}
                      </h3>

                      {/* Color buttons */}
                      <div className="flex justify-center space-x-4 mb-2 mt-2">
                        {product.warna.split(',').map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(product.id, color)}
                            className={`w-8 h-8 rounded-full border ${
                              selectedColors[product.id] === color
                                ? 'ring-2 ring-blue-400'
                                : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={color}
                            title={color}
                          />
                        ))}
                      </div>

                      <p className={`${inter.className} text-xl italic text-white text-opacity-80`}>
                        Rp {product.harga.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="p-4 bg-white bg-opacity-10 rounded-full text-center hover:bg-opacity-20 transition">
                      <p className={`${inter.className} text-xl italic text-white text-opacity-80`}>
                        See More
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
