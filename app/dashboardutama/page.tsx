'use client';

import Image from 'next/image';

const DashboardUtamaPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br p-12 text-white font-sans">
      {/* RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        {[
          { title: 'Total Orders', value: '100' },
          { title: 'Total Transactions', value: '100' },
          { title: 'Total Income', value: 'Rp 10.000.000' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#303477] border-4 border-[#303477] rounded-3xl p-10 text-center"
          >
            <p className="text-2xl font-bold text-white tracking-wide">{item.title}</p>
            <p className="text-5xl font-extrabold mt-4 text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* GRAFIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {[
          { title: 'Income Graph / Month', src: '/income-graph.png', alt: 'Income Graph' },
          { title: 'Customers Graph / Month', src: '/customers-graph.png', alt: 'Customers Graph' },
        ].map((graph, idx) => (
          <div
            key={idx}
            className="bg-[#303477] border-4 border-[#303477] rounded-3xl p-8"
          >
            <p className="text-2xl font-semibold mb-6 text-white">{graph.title}</p>
            <Image
              src={graph.src}
              alt={graph.alt}
              width={700}
              height={300}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* PRODUK TERLARIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {['Most Products Sold / Month', 'Most Purchased Products / Month'].map((title, idx) => (
          <div
            key={idx}
            className="bg-[#303477] border-4 border-[#303477] rounded-3xl p-8 text-center"
          >
            <p className="text-2xl font-semibold mb-6 text-white">{title}</p>
            <Image src="/airbuds.png" alt="Airpod" width={200} height={200} className="mx-auto rounded-xl" />
            <p className="mt-6 text-3xl font-bold text-white tracking-wide">Airpod</p>
            <p className="text-xl text-gray-300 mt-2">Rp 500.000</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUtamaPage;
