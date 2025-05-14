'use client';

import { inter } from '@/app/ui/fonts';
import Image from 'next/image';

// Background image configuration
const backgroundImages = [
  { src: "/headphone.png", className: "top-10 left-10 rotate-12" },
  { src: "/airbuds.png", className: "bottom-10 left-10 -rotate-12" },
  { src: "/earphone.png", className: "top-10 right-10 -rotate-12" },
  { src: "/airpods.png", className: "bottom-10 right-10 rotate-12" },
];

export default function Page() {
  return (
    <div className="relative p-4 text-center min-h-screen text-white overflow-hidden">
      {/* Background images with animations */}
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute ${img.className} w-[500px] h-[500px] z-0 drop-shadow-[0_20px_25px_rgba(0,0,0,1)] animate__animated animate__fadeIn animate__delay-${index * 2}s`}
        >
          <Image
            src={img.src}
            alt="Background product"
            fill
            className="object-contain"
          />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10">
        <h2 className={`${inter.className} text-5xl font-bold text-white animate__animated animate__fadeIn animate__delay-2s`}>
          Our Products Will Guarantee Your Satisfaction.
        </h2>
        <p className={`${inter.className} mt-2 text-3xl mx-auto animate__animated animate__fadeIn animate__delay-3s`}>
          Our Products Are Guaranteed Authentic And Come With A Warranty, Ensuring Quality, Reliability, And Peace Of Mind With Every Purchase.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate__animated animate__fadeIn animate__delay-4s">
          {/* Box 1 - Overall Rating */}
          <div className="flex flex-col h-full">
            <div className="flex-grow bg-[#303477] border border-white border-opacity-20 rounded-lg p-6 transform hover:scale-105 transition duration-500 ease-in-out">
              <div className="h-full flex flex-col">
                <div className="flex-grow mb-6 p-4 flex justify-center items-center bg-white bg-opacity-10 rounded-2xl">
                  <div className="text-center p-4 w-full">
                    <h3 className={`${inter.className} text-2xl font-semibold mb-4`}>Overall Rating</h3>
                    <div className="text-8xl font-bold mt-24 mb-4">4.5 / 5</div>
                    <div className="text-6xl mb-4">★★★★☆</div>
                    <div className="text-lg">1000 Reviewers</div>
                  </div>
                </div>
                <div className="p-4 bg-white bg-opacity-10 rounded-full text-center">
                  <button className={`${inter.className} text-xl text-white hover:underline transition transform hover:scale-110 duration-300 ease-in-out`}>
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2 - Rating Breakdown */}
          <div className="flex flex-col h-full">
            <div className="flex-grow bg-[#303477] border border-white border-opacity-20 rounded-lg p-6 transform hover:scale-105 transition duration-500 ease-in-out">
              <div className="h-full flex flex-col">
                <div className="flex-grow mb-6 p-4 flex justify-center items-center bg-white bg-opacity-10 rounded-2xl">
                  <div className="w-full p-4">
                    <h3 className={`${inter.className} text-2xl font-semibold mb-8 text-center`}>Rating Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { stars: "★", width: "3%", count: 30 },
                        { stars: "★★", width: "2%", count: 20 },
                        { stars: "★★★", width: "10%", count: 100 },
                        { stars: "★★★★", width: "70%", count: 700 },
                        { stars: "★★★★★", width: "10%", count: 100 },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-16 flex">{item.stars}</div>
                          <div className="flex-1 h-4 bg-gray-600 rounded-full mx-2 overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: item.width }}></div>
                          </div>
                          <div className="w-12 text-right">{item.count}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">1000 Reviewers</div>
                  </div>
                </div>
                <div className="p-4 bg-white bg-opacity-10 rounded-full text-center">
                  <button className={`${inter.className} text-xl text-white hover:underline transition transform hover:scale-110 duration-300 ease-in-out`}>
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3 - Most Helpful Reviews */}
          <div className="flex flex-col h-full">
            <div className="flex-grow bg-[#303477] border border-white border-opacity-20 rounded-lg p-6 transform hover:scale-105 transition duration-500 ease-in-out">
              <div className="h-full flex flex-col">
                <div className="flex-grow mb-6 p-4 flex justify-center items-center bg-white bg-opacity-10 rounded-2xl">
                  <div className="w-full p-4">
                    <h3 className={`${inter.className} text-2xl font-semibold mb-4 text-center`}>Most Helpful Reviews</h3>
                    <div>
                      <div className="w-24 h-24 bg-white rounded-xl text-center overflow-hidden mb-4 mx-auto">
                        <Image 
                          src="/team.png"
                          alt="Dinoris" 
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      </div>
                      <div className="font-bold mb-1">Arel Dinoris</div>
                      <div className="text-xl font-bold mb-2">4.5 / 5</div>
                      <div className="text-2xl mb-4">★★★★☆</div>
                      <p className="text-lg italic mb-2">
                        "I was hesitant at first, but Bazeus proved to be trustworthy! The AirPods were original, arrived in perfect condition, and worked flawlessly. Delivery was slightly delayed, but overall I'm very satisfied. Will definitely order again!"
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white bg-opacity-10 rounded-full text-center">
                  <button className={`${inter.className} text-xl text-white hover:underline transition transform hover:scale-110 duration-300 ease-in-out`}>
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
