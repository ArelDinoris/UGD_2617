'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserGroupIcon,
  TagIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { PowerIcon } from '@heroicons/react/24/outline';

const links = [
  { name: 'Dashboard', href: '/dashboardutama', icon: HomeIcon },
  { name: 'Sales', href: '/dashboardutama/sales', icon: ShoppingCartIcon },
  { name: 'Products', href: '/dashboardutama/product', icon: CubeIcon },
  { name: 'Sales Details', href: '/dashboardutama/salesdetails', icon: DocumentTextIcon },
  
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col space-y-1 ${lusitana.className}`}>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex items-center gap-3 rounded-md px-3 py-2 text-xl text-white font-medium hover:bg-[#9fa2e6]',
              {
                'text-gray-600': pathname !== link.href,
                'bg-[#1b1b69] text-blue-600': pathname === link.href,
              }
            )}
          >
            <LinkIcon className="h-8 w-8" />
            <p>{link.name}</p>
          </Link>
        );
      })}
      
      <div className="mt-16 pt-[435px] space-y-2">
        <Link
          href="/dashboardutama/settings"
          className={clsx(
            'bg-[#121842] flex items-center gap-3 rounded-md px-3 py-2 text-xl text-white font-medium hover:bg-[#9fa2e6]',
            {
              'text-gray-600': pathname !== '/dashboardutama/settings',
              'bg-[#1b1b69] text-blue-600': pathname === '/dashboardutama/settings',
            }
          )}
        >
          <CogIcon className="h-8 w-8" />
          <p>Settings</p>
        </Link>
        <Link
          href="/dashboardutama/logout"
          className={clsx(
            'bg-[#121842] flex items-center gap-3 rounded-md px-3 py-2 text-xl text-white font-medium hover:bg-[#9fa2e6]',
            {
              'text-gray-600': pathname !== '/dashboardutama/logout',
              'bg-[#1b1b69] text-blue-600': pathname === '/dashboardutama/logout',
            }
          )}
        >
          <PowerIcon className="h-8 w-8" />
          <p>Logout</p>
        </Link>
      </div>
    </div>
  );
}