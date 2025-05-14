import Image from 'next/image';

export default function BaseusProducts() {
    return (
        <div className="max-w-8xl mx-auto px-4 py-8 font-sans">
            <div className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column - Images and See More */}
                    <div className="md:w-1/2">
                        <div className="rounded-xl shadow-md overflow-hidden border-[15px] border-[#999999] mb-6">
                            <div className="relative h-[800px] w-full flex bg-[#2D3186] overflow-visible">
                                {/* Headphones Image - Left Side */}
                                <div className="relative w-3/5 h-full drop-shadow-[0_20px_25px_rgba(0,0,0,1)]">
                                    <Image
                                        src="/headphone.png"
                                        alt="Baseus Headphones"
                                        fill
                                        className="object-contain scale-200"
                                        style={{
                                            top: '-5%',
                                        }}
                                        sizes="(max-width: 1500px) 60vw, 30vw"
                                        priority
                                    />
                                </div>

                                {/* Earbuds Image - Right Side */}
                                <div className="relative w-2/5 h-full drop-shadow-[0_20px_25px_rgba(0,0,0,1)]">
                                    <Image
                                        src="/airbuds.png"
                                        alt="Baseus Earbuds"
                                        fill
                                        className="object-contain scale-200"
                                        style={{
                                            top: '30%',
                                            left: '-15%'
                                        }}
                                        sizes="(max-width: 1000px) 40vw, 20vw"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-xl shadow-md overflow-hidden border-[15px] border-[#999999]">
                            <button className="w-full py-4 text-2xl md:text-4xl bg-[#2D3186] text-white transition font-semibold rounded-none">
                                See More
                            </button>
                        </div>
                        
                    </div>

                    {/* Right Column - Other Content */}
                    <div className="md:w-1/2 space-y-6">
                        {/* Header Section */}
                        <div className="text-left mb-10">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
                                Explore official baseus products such as Earphones, Headphones, Headsets, and other accessories.
                            </h1>
                            <p className="text-xl sm:text-2xl md:text-3xl text-white">
                                At Baseus, your satisfied smile is our happiness.
                            </p>
                        </div>

                        {/* Three Column Section - Centered */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Location Box */}
                            <div className="flex flex-col h-full">
                                <div className="bg-[#999999] rounded-xl p-4 flex-1 flex flex-col">
                                    <div className="bg-[#2D3186] p-4 rounded-lg shadow-sm flex-1 flex flex-col">
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 text-white text-center">Our Location</h2>
                                        <div className="relative h-40 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                            <Image
                                                src="/loc.png"
                                                alt="Baseus Store Location"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                        <p className="mb-3 mt-5 text-base md:text-lg lg:text-xl text-white text-center flex-1">
                                            Jl. Babarsari No.43, Janti, <br />
                                            Caturtunggal, Kec. Depok, <br />
                                            Kabupaten Sleman, Daerah Istimewa Yogyakarta <br /> 55281 <br />
                                            Monday - Friday <br />
                                            10.00 AM - 04.00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Commitment Box */}
                            <div className="flex flex-col h-full">
                                <div className="bg-[#999999] rounded-xl p-4 border border-[#999999] flex-1 flex flex-col">
                                    <div className="bg-[#2D3186] p-4 rounded-lg shadow-sm flex-1 flex flex-col">
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 text-white text-center">Commitment</h2>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-xl md:text-2xl text-white text-center">Customer Satisfaction</h3>
                                            <p className="text-white text-base md:text-lg lg:text-xl mt-3 mb-3 text-center">
                                                We prioritize your happiness with every interaction, ensuring premium service and support.
                                            </p>
                                            <h3 className="font-semibold text-xl md:text-2xl text-white text-center">Quality Products</h3>
                                            <p className="text-white text-base md:text-lg lg:text-xl mt-3 mb-3 text-center">
                                                Only authentic Apple products, thoroughly tested and certified for excellence.
                                            </p>
                                            <h3 className="font-semibold text-xl md:text-2xl text-white text-center">Innovation Focus</h3>
                                            <p className="text-white mt-1 text-base md:text-lg lg:text-xl text-center">
                                                Constantly evolving our services to match the latest technology trends.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Achievements Box */}
                            <div className="flex flex-col h-full">
                                <div className="bg-[#999999] rounded-xl p-4 border border-[#999999] flex-1 flex flex-col">
                                    <div className="bg-[#2D3186] p-4 rounded-lg flex-1 flex flex-col">
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 text-white text-center">Achievements</h2>
                                        <div className="flex-1">
                                            <p className="font-bold text-white text-xl md:text-2xl text-center">$1M+ Revenue</p>
                                            <p className="text-white text-base md:text-lg lg:text-xl mt-3 mb-3 text-center">
                                                Achieved million-dollar valuation in first year of operations.
                                            </p>
                                            <p className="font-bold text-white text-xl md:text-2xl text-center">Impact Award</p>
                                            <p className="text-white text-base md:text-lg lg:text-xl mt-3 mb-3 text-center">
                                                AlBox excels with outstanding brand performance in the Indonesian market.
                                            </p>
                                            <p className="font-bold text-white text-xl md:text-2xl text-center">500K+ Buyers</p>
                                            <p className="text-white text-base md:text-lg lg:text-xl mt-3 text-center">
                                                Building a strong base of customer trust and satisfaction across multiple regions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> {/* End Three Column */}
                    </div>
                </div>
            </div>
        </div>
    );
}