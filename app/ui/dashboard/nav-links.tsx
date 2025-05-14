'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';

const links = [
  { name: 'Home', href: '/dashboard' },
  { name: 'Our Team', href: '/dashboard/ourteam' },
  { name: 'Product', href: '/dashboard/products' },
  { name: 'Review', href: '/dashboard/review' },
  { name: 'Sign In/ Sign Up', href: '/dashboard/signin', special: true }, 
];

export default function NavLinks() {
  const pathname = usePathname();
  
  return (
    <>
      <div className={`flex space-x-4 ${lusitana.className}`}>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'px-4 py-2 text-xl md:text-2xl lg:text-3xl font-medium transition-all duration-200 whitespace-nowrap',
              {
                'text-gray-300 hover:text-white': pathname !== link.href && !link.special,
                'text-white border-b-4 border-white': pathname === link.href && !link.special, // Garis bawah putih ketika dipilih
                'bg-gray-500/50 text-white rounded-lg hover:bg-gray-500/80 border-b-4 border-white': // Garis putih bawah tombol Sign In/Sign Up
                  link.special && pathname === link.href, // Tambahkan border saat tombol ini aktif
                'bg-gray-500/50 text-white rounded-lg hover:bg-gray-500/80': // Tombol Sign In/Sign Up dengan background abu transparan
                  link.special && pathname !== link.href, 
              }
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
      
      {/* Footer component that will be rendered at the bottom of all pages */}
      <div className="fixed bottom-0 left-0 w-full bg-navy-900 py-3 text-center text-white text-sm border-t border-gray-800">
        © 2025 Bazeus. All rights reserved.{' '}
        <Link href="/terms" className="hover:underline mx-1">Terms of Service</Link>
        <span className="mx-1">|</span>
        <Link href="/privacy" className="hover:underline mx-1">Privacy Policy</Link>
        <span className="mx-1">|</span>
        <Link href="/cookies" className="hover:underline mx-1">Cookie Policy</Link>
      </div>
    </>
  );
}