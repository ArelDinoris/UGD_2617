import NavLinks from '@/app/ui/dashboard/nav-links';

export default function CenterNav() {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 ">
      {/* Logo - Pojok Kiri */}
      <div className="flex-shrink-0 z-50 text-2xl text-white">Bazues</div>

      {/* Navigasi - Tengah */}
      <div className="hidden md:flex items-center gap-6 z-50">
        <NavLinks />
      </div>
    </div>
  );
}