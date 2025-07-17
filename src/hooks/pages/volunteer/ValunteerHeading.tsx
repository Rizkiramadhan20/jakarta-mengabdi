import React from 'react'
import Image from 'next/image'
import img1 from '@/base/assets/Group.png'
import img2 from '@/base/assets/Group.png'
import pilarImg from '@/base/assets/pilar.png'
import dropdown from '@/base/assets/arrow.png'
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select'

interface ValunteerHeadingProps {
    locations: string[];
    selectedCategory: string | 'all';
    setSelectedCategory: (v: string) => void;
    selectedLocation: string | 'all';
    setSelectedLocation: (v: string) => void;
    sortOrder: 'desc' | 'asc' | 'all';
    setSortOrder: (v: 'desc' | 'asc' | 'all') => void;
    getLastLocationPart: (loc: string) => string;
}

export default function ValunteerHeading({
    locations,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    sortOrder,
    setSortOrder,
    getLastLocationPart,
}: ValunteerHeadingProps) {
    return (
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
            <div className="container mx-auto px-4 md:px-14 relative z-10 flex flex-col items-center text-center">
                {/* Decorative Images */}
                <Image
                    src={img1}
                    alt="dekorasi kiri atas"
                    width={40} height={40}
                    className="absolute left-2 top-10 md:left-12 md:top-0 md:w-24 md:h-24 z-0 hidden md:block"
                />

                <Image
                    src={img2}
                    alt="dekorasi kanan bawah"
                    width={40} height={40}
                    className="absolute right-2 bottom-2 md:right-12 md:bottom-24 w-8 h-8 md:w-24 md:h-24 z-0 rotate-30 hidden md:block"
                />

                <h1 className="text-3xl md:text-4xl font-bold text-[#F29920] mb-6 md:mb-10 leading-snug md:leading-normal">Bergabung Menjadi Volunteer<br />Jakarta Mengabdi</h1>

                <p className="text-base md:text-xl text-gray-700 max-w-md md:max-w-4xl mb-6 md:mb-8">
                    Volunteer adalah tulang punggung Jakarta Mengabdi yang memungkinkan komunitas ini untuk melaksanakan program-program dengan efektif dan mewujudkan semangat pengabdian dalam skala yang lebih luas di lingkungan Jakarta. Volunteer adalah individu yang didorong semangat gotong royong, aktif dalam komunitas dan berperan penting dalam mencapai tujuan visi misi komunitas ini.
                </p>

                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 mt-6 md:mt-12 max-w-md md:max-w-5xl mx-auto">
                    {/* Filter Pilar (Category) */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="flex items-center gap-1 px-2 md:px-4 py-5 rounded-none text-sm md:text-base font-medium w-full capitalize">
                            <div className="flex items-center w-full justify-between gap-1">
                                <div className='flex items-center gap-1 md:gap-2'>
                                    <Image src={pilarImg} alt="Pilar" width={18} height={18} className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="flex-1 text-center">
                                        {selectedCategory === 'all' ? 'Pilih Pilar' : selectedCategory}
                                    </span>
                                </div>
                                <Image src={dropdown} alt="Dropdown" width={12} height={12} className="w-3 h-3" />
                            </div>
                        </SelectTrigger>
                        <SelectContent side="bottom" className="py-1 md:py-2">
                            <div className="flex flex-col gap-1 md:gap-2 px-1 md:px-2">
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base transition-all ${selectedCategory === 'all' ? 'ring-2 ring-orange-400' : ''} bg-gray-200 text-black`}
                                    onClick={() => setSelectedCategory('all')}
                                    type="button"
                                >
                                    Pilar
                                </button>
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base transition-all ${selectedCategory === 'Pilar Cerdas' ? 'ring-2 ring-yellow-400 scale-105' : ''} bg-yellow-400 text-white`}
                                    onClick={() => setSelectedCategory('Pilar Cerdas')}
                                    type="button"
                                >
                                    Pilar Cerdas
                                </button>
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base transition-all ${selectedCategory === 'Pilar Sehat' ? 'ring-2 ring-sky-400 scale-105' : ''} bg-sky-400 text-white`}
                                    onClick={() => setSelectedCategory('Pilar Sehat')}
                                    type="button"
                                >
                                    Pilar Sehat
                                </button>
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base transition-all ${selectedCategory === 'Pilar Lestari' ? 'ring-2 ring-green-400 scale-105' : ''} bg-green-400 text-white`}
                                    onClick={() => setSelectedCategory('Pilar Lestari')}
                                    type="button"
                                >
                                    Pilar Lestari
                                </button>
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base transition-all ${selectedCategory === 'Pilar Peduli' ? 'ring-2 ring-pink-300 scale-105' : ''} bg-pink-300 text-white`}
                                    onClick={() => setSelectedCategory('Pilar Peduli')}
                                    type="button"
                                >
                                    Pilar Peduli
                                </button>
                            </div>
                        </SelectContent>
                    </Select>

                    {/* Filter Urutkan */}
                    <Select value={sortOrder} onValueChange={v => setSortOrder(v as 'desc' | 'asc' | 'all')}>
                        <SelectTrigger className="flex items-center gap-1 bg-white px-2 md:px-4 py-5 rounded-none text-sm md:text-base font-bold w-full border border-gray-200">
                            <div className="flex items-center w-full justify-between gap-1">
                                <div className='flex items-center gap-1 md:gap-2'>
                                    {/* Icon filter/urutkan */}
                                    <svg width="16" height="16" className="md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M7 12h10M11 18h6" /></svg>
                                    <span className="flex-1 text-center">
                                        {sortOrder === 'desc' ? 'Terbaru' : sortOrder === 'asc' ? 'Terlama' : 'Urutkan'}
                                    </span>
                                </div>
                                <Image src={dropdown} alt="Dropdown" width={12} height={12} className="w-3 h-3" />
                            </div>
                        </SelectTrigger>
                        <SelectContent side="bottom" className="py-1 md:py-2 bg-white border border-orange-400 rounded-none mt-1">
                            <div className="border-b border-orange-400 mb-1 md:mb-2 -mx-1 md:-mx-2"></div>
                            <div className="flex flex-col gap-1 md:gap-2 px-1 md:px-2">
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base border-2 transition-all ${sortOrder === 'all' ? 'border-black bg-gray-100' : 'border-black bg-white'} text-black`}
                                    onClick={() => setSortOrder('all')}
                                    type="button"
                                >
                                    Semua
                                </button>
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base border-2 transition-all ${sortOrder === 'desc' ? 'border-black bg-gray-100' : 'border-black bg-white'} text-black`}
                                    onClick={() => setSortOrder('desc')}
                                    type="button"
                                >
                                    Terbaru
                                </button>
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base border-2 transition-all ${sortOrder === 'asc' ? 'border-black bg-gray-100' : 'border-black bg-white'} text-black`}
                                    onClick={() => setSortOrder('asc')}
                                    type="button"
                                >
                                    Terlama
                                </button>
                            </div>
                        </SelectContent>
                    </Select>

                    {/* Filter Location */}
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="flex items-center gap-1 bg-white px-2 md:px-4 py-5 rounded-none text-sm md:text-base font-bold w-full border border-gray-200">
                            <div className="flex items-center w-full justify-between gap-1">
                                <div className='flex items-center gap-1 md:gap-2'>
                                    {/* Icon location */}
                                    <svg width="16" height="16" className="md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3" /><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.5 11 9 11s9-5.75 9-11c0-4.97-4.03-9-9-9z" /></svg>
                                    <span className="flex-1 text-center">
                                        {selectedLocation === 'all' ? 'Lokasi' : getLastLocationPart(selectedLocation)}
                                    </span>
                                </div>
                                <Image src={dropdown} alt="Dropdown" width={12} height={12} className="w-3 h-3" />
                            </div>
                        </SelectTrigger>
                        <SelectContent side="bottom" className="py-1 md:py-2 bg-white border border-orange-400 rounded-none mt-1">
                            <div className="border-b border-orange-400 mb-1 md:mb-2 -mx-1 md:-mx-2"></div>
                            <div className="flex flex-col gap-1 md:gap-2 px-1 md:px-2">
                                <button
                                    className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base border-2 transition-all ${selectedLocation === 'all' ? 'border-black bg-gray-100' : 'border-black bg-white'} text-black`}
                                    onClick={() => setSelectedLocation('all')}
                                    type="button"
                                >
                                    Semua Lokasi
                                </button>
                                {locations.map((loc) => (
                                    <button
                                        key={loc}
                                        className={`w-full py-1 md:py-2 rounded-full font-bold text-sm md:text-base border-2 transition-all ${selectedLocation === loc ? 'border-black bg-gray-100' : 'border-black bg-white'} text-black`}
                                        onClick={() => setSelectedLocation(loc)}
                                        type="button"
                                    >
                                        {getLastLocationPart(loc)}
                                    </button>
                                ))}
                            </div>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </section>
    )
}
