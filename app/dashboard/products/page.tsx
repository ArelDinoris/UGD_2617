'use client';

import { inter } from '@/app/ui/fonts';
import Image from 'next/image';
import { useState } from 'react';

// Type declarations
type ColorOption = {
  name: string;
  value: string;
  class: string;
};

type Product = {
  name: string;
  price: string;
  image: string;
  colors: ColorOption[];
};

const products: Product[] = [
  {
    name: "Headphone",
    price: "Rp 500.000",
    image: "/headphone.png",
    colors: [
      { name: "Black", value: "black", class: "bg-black border border-gray-300" },
      { name: "White", value: "white", class: "bg-white border border-gray-300" }
    ]
  },
  {
    name: "Airpod",
    price: "Rp 500.000",
    image: "/airbuds.png",
    colors: [
      { name: "Black", value: "black", class: "bg-black border border-gray-300" },
      { name: "White", value: "white", class: "bg-white border border-gray-300" }
    ]
  },
  {
    name: "Headset",
    price: "Rp 200.000",
    image: "/earphone.png",
    colors: [
      { name: "Black", value: "black", class: "bg-black border border-gray-300" },
      { name: "White", value: "white", class: "bg-white border border-gray-300" }
    ]
  },
  {
    name: "Accesories",
    price: "Rp 50.000",
    image: "/airpods.png",
    colors: [
      { name: "Black", value: "black", class: "bg-black border border-gray-300" },
      { name: "White", value: "white", class: "bg-white border border-gray-300" }
    ]
  }
];

const backgroundImages = [
  { src: "/headphone.png", className: "top-10 left-10 rotate-12" },
  { src: "/airbuds.png", className: "bottom-10 left-10 -rotate-12" },
  { src: "/earphone.png", className: "top-10 right-10 -rotate-12" },
  { src: "/airpods.png", className: "bottom-10 right-10 rotate-12" },
];

export default function Page() {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    products.reduce((acc: Record<string, string>, product) => {
      acc[product.name] = product.colors[0].value;
      return acc;
    }, {})
  );

  const handleColorSelect = (productName: string, colorValue: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productName]: colorValue,
    }));
  };

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

      {/* Main content */}
      <div className="relative z-10">
        <h2 className={`${inter.className} text-5xl font-bold text-white`}>
          Our Products Will Guarantee Your Satisfaction.
        </h2>
        <p className={`${inter.className} mt-2 text-3xl mx-auto`}>
          Our Products Are Guaranteed Authentic And Come With A Warranty, Ensuring Quality, Reliability, And Peace Of Mind With Every Purchase.
        </p>
        
        <div className='flex justify-center'>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 w-full">
            {products.map((product, index) => (
              <div key={index} className="flex flex-col h-full">
                <div className="flex-grow bg-[#303477] border border-white border-opacity-20 rounded-lg p-6">
                  <div className="h-full flex flex-col">
                    {/* Image box */}
                    <div className="flex-grow mb-6 p-4 bg-white bg-opacity-10 rounded-2xl flex flex-col items-center">
                      <div className="relative aspect-square w-full max-w-[250px] flex-grow">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      
                      <h3 className={`${inter.className} text-2xl font-semibold text-white mt-4`}>
                        {product.name}
                      </h3>
                      {/* Color selection */}
                      <div className="flex justify-center space-x-4 mb-2 mt-2">
                        {product.colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleColorSelect(product.name, color.value)}
                            className={`w-8 h-8 rounded-full ${color.class} ${
                              selectedColors[product.name] === color.value
                              ? 'ring-2 ring-blue-400' 
                              : ''
                            } transition-all`}
                            aria-label={color.name}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <p className={`${inter.className} text-xl italic text-white text-opacity-80`}>
                        {product.price}
                      </p>
                    </div>
                    
                    {/* See More button */}
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
