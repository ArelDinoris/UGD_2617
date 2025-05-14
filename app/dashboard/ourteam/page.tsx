import { inter } from '@/app/ui/fonts';
import Image from 'next/image';

const artists = [
  {
    name: "Arel",
    role: "CEO and Founder Bazeus",
    image: "/team.png",
  },
  {
    name: "Lafito",
    role: "Head Manager Bazeus",
    image: "/team.png",
  },
  {
    name: "Dinoris",
    role: "Staff Bazeus",
    image: "/team.png",
  }
];

// Tambahkan array untuk gambar background
const backgroundImages = [
  { src: "/headphone.png", className: "top-10 left-10 rotate-12" },
  { src: "/airbuds.png", className: "bottom-10 left-10 -rotate-12" },
  { src: "/earphone.png", className: "top-10 right-10 -rotate-12" },
  { src: "/airpods.png", className: "bottom-10 right-10 rotate-12" },
];

export default function Page() {
  return (
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

      {/* Konten utama dengan z-index lebih tinggi */}
      
      <div className="relative z-10">
        <h2 className={`${inter.className} text-5xl font-bold text-white`}>
          OUR TEAM CONSISTS OF EXPERTS WHO ARE EXPERIENCED IN TECHNOLOGY AND SERVICE
        </h2>
        <p className={`${inter.className} mt-2 text-3xl mx-auto`}>
          Our Brand Philosophy Is To Serve And Fulfill Customer Needs With Excellence Prioritizing Accuracy, Responsibility, And A Genuine Commitment To Customer Satisfaction.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 justify-items-center">
          {artists.map((artist, index) => (
            <div key={index} className="relative bg-[#303477] border border-white border-opacity-20 rounded-lg p-6 w-full md:max-w-md">
              {/* Image box */}
              <div className="mb-6 p-4 flex justify-center items-center bg-white bg-opacity-10 rounded-2xl">
                <Image 
                  src={artist.image} 
                  alt={artist.name} 
                  width={300} 
                  height={300}
                  className="object-cover"
                />
              </div>
              
              {/* Text box */}
              <div className="p-4 bg-white bg-opacity-10 rounded-full text-center">
                <h3 className={`${inter.className} text-2xl font-semibold text-white`}>{artist.name}</h3>
                <p className={`${inter.className} text-xl italic text-white text-opacity-80`}>{artist.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}