'use client';

import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white px-4">
      <div className="relative bg-[#303477] rounded-3xl p-12 max-w-2xl w-full animate-fadeIn">
        <h2 className="text-4xl font-extrabold mb-8 text-white text-center">
          Are you sure you want to log out?
        </h2>
        <div className="flex justify-center gap-10 mt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white px-8 py-4 rounded-xl text-xl font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-8 py-4 rounded-xl text-xl font-semibold"
          >
            Yes
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
