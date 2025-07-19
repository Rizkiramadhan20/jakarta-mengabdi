"use client"

import { Donasi } from '@/interface/donasi'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';

import { Separator } from '@/components/ui/separator';

import Image from 'next/image';

import logo from '@/base/assets/Ellipse.png'

import React, { useState, useEffect } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { formatIDR, getRawNumberFromIDR } from '@/base/helper/FormatPrice';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';

import { Banknote } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';

import { format } from 'date-fns';

import { id } from 'date-fns/locale';

interface DonasiDetailsContentProps {
    donasiData: Donasi | null;
}

const recentDonors = [
    { name: "Andorra kumargi", amount: "Rp 50.000" },
    { name: "Siti Aisyah", amount: "Rp 100.000" },
    { name: "Budi Santoso", amount: "Rp 25.000" },
];

export default function DonasiDetailsContent({ donasiData }: DonasiDetailsContentProps) {
    if (!donasiData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Data Tidak Ditemukan</h1>
                    <p className="text-gray-600">Donasi yang Anda cari tidak ditemukan.</p>
                </div>
            </div>
        );
    }

    const daysLeft = donasiData.deadline ? Math.ceil((new Date(donasiData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30;
    const progress = (donasiData.current_amount / donasiData.target_amount) * 100;

    // Helper untuk memotong HTML ke 100 kata pertama
    function truncateHtmlWords(html: string, wordLimit: number) {
        // Hilangkan tag HTML untuk hitung kata
        const text = html.replace(/<[^>]+>/g, ' ');
        const words = text.split(/\s+/).filter(Boolean);
        if (words.length <= wordLimit) return html;
        // Ambil 100 kata pertama dari text
        const truncatedText = words.slice(0, wordLimit).join(' ');
        // Untuk preview, hilangkan HTML dan tampilkan plain text saja
        return truncatedText + '...';
    }

    const [showFullContent, setShowFullContent] = useState(false);
    const contentWordCount = donasiData?.content ? donasiData.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : 0;
    const shouldTruncate = contentWordCount > 100;

    const [activeTab, setActiveTab] = useState<'deskripsi' | 'doa' | 'dukungan'>('deskripsi');

    const { profile } = useAuth();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [price, setPrice] = useState<number>(10000); // default 10.000
    const [donationMode, setDonationMode] = useState<'manual' | 'preset'>('preset');
    const presetOptions = [10000, 25000, 50000, 100000, 150000];

    const [showPrayerModal, setShowPrayerModal] = useState(false);
    const [prayer, setPrayer] = useState("");

    const [prayers, setPrayers] = useState<any[]>([]);
    const [loadingPrayers, setLoadingPrayers] = useState(false);

    const [recentDonors, setRecentDonors] = useState<any[]>([]);
    const [loadingDonors, setLoadingDonors] = useState(false);

    const [showClosedModal, setShowClosedModal] = useState(false);

    useEffect(() => {
        async function fetchPrayers() {
            if (!donasiData?.id) return;
            setLoadingPrayers(true);
            const res = await fetch(`/api/donasi/prayer?donasi_id=${donasiData.id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
                },
            });
            const data = await res.json();
            setPrayers(data.prayers || []);
            setLoadingPrayers(false);
        }
        fetchPrayers();
    }, [donasiData?.id]);

    useEffect(() => {
        async function fetchRecentDonors() {
            if (!donasiData?.id) return;
            setLoadingDonors(true);
            const res = await fetch(`/api/donasi/insert-transaction?donasi_id=${donasiData.id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
                },
            });
            const data = await res.json();
            setRecentDonors(data.donors || []);
            setLoadingDonors(false);
        }
        fetchRecentDonors();
    }, [donasiData?.id]);

    const handleOpenModal = () => {
        if (!profile) {
            toast.error('Anda harus login untuk melakukan donasi.');
            setTimeout(() => {
                router.push('/signin');
            }, 1000);
            return;
        }

        // Check if donasi status is closed
        if (donasiData?.status === 'closed') {
            setShowClosedModal(true);
            return;
        }

        setShowModal(true);
    };
    const handleSubmitPrice = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(false);
        await handleDonate(price);
    };

    // Fungsi untuk insert transaksi ke Supabase via API route
    const insertTransaction = async (result: any, status: string) => {
        if (!donasiData) return;
        const order_id = result.order_id || `DONASI-${donasiData.id}-${Date.now()}`;
        const name = profile?.full_name || 'Donatur';
        const email = profile?.email || 'donatur@email.com';
        const photo_url = profile?.photo_url || null;
        const gross_amount = result.gross_amount || price;
        const image_url = donasiData.image_url || null;
        await fetch('/api/donasi/insert-transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id,
                donasi_id: donasiData.id,
                name,
                email,
                photo_url,
                image_url,
                amount: gross_amount,
                status,
                payment_type: result.payment_type,
                transaction_time: (result as any).transaction_time || new Date().toISOString(),
                midtrans_response: result,
            }),
        });
    };

    const handleDonate = async (gross_amount: number) => {
        if (!donasiData) return;
        const order_id = `DONASI-${donasiData.id}-${Date.now()}`;
        const name = profile?.full_name || 'Donatur';
        const email = profile?.email || 'donatur@email.com';
        const photo_url = profile?.photo_url || null;

        const res = await fetch('/api/donasi/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id, gross_amount, name, email }),
        });
        const data = await res.json();
        if (data.token) {
            // @ts-ignore
            window.snap.pay(data.token, {
                onSuccess: async function (result) {
                    await insertTransaction(result, 'settlement');
                    setShowPrayerModal(true); // Show prayer modal
                },
                onPending: async function (result) {
                    await insertTransaction(result, 'pending');
                    toast('Pembayaran Anda sedang diproses');
                    window.location.href = `/donasi/${donasiData.slug}?order_id=${order_id}&status_code=200&transaction_status=pending`;
                },
                onError: function (result) {
                    toast.error('Pembayaran gagal. Silakan coba lagi.');
                },
                onClose: function () {
                    toast('Anda membatalkan pembayaran.');
                }
            });
        } else {
            alert('Gagal memulai pembayaran');
        }
    };

    const handleSubmitPrayer = async () => {
        if (!prayer.trim()) {
            toast.error('Doa tidak boleh kosong.');
            return;
        }
        await fetch('/api/donasi/prayer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                donasi_id: donasiData.id,
                name: profile?.full_name,
                email: profile?.email,
                photo_url: profile?.photo_url,
                prayer,
            }),
        });
        setShowPrayerModal(false);
        setPrayer("");
        window.location.href = `/donasi/${donasiData.slug}?success=1`;
    };

    return (
        <section className="py-28">
            <div className="container px-4 md:px-18">
                <div className="text-sm text-gray-500 mb-4">
                    Beranda &gt; Donasi &gt; {donasiData.title}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 flex flex-col space-y-4">
                        <Image
                            src={donasiData.image_url as string}
                            alt={donasiData.title}
                            className="w-full h-[40%] object-cover rounded-lg mb-6"
                            width={1000}
                            height={1000}
                        />
                        <h1 className="text-3xl font-bold text-gray-800">{donasiData.title}</h1>

                        {/* Konten dengan overlay jika terpotong */}
                        <div className="relative mt-5">
                            <div
                                className="prose prose-gray dark:prose-invert max-w-none
                                  prose-headings:text-primary prose-headings:font-semibold 
                                  prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-6 prose-h1:leading-tight
                                  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4
                                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-base 
                                  prose-p:md:text-lg prose-p:mb-6
                                  prose-strong:text-foreground prose-strong:font-semibold
                                  prose-em:text-primary/80 prose-em:not-italic
                                  prose-ol:mt-4 prose-ol:mb-6 prose-ol:list-none prose-ol:space-y-3
                                  prose-li:text-muted-foreground prose-li:relative prose-li:pl-6
                                  prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-primary/60
                                  [&_li[data-list='bullet']]:before:content-['•']
                                  [&_li[data-list='bullet']]:before:text-lg
                                  [&_li[data-list='bullet']]:before:leading-tight
                                  [&_.ql-video]:w-full [&_.ql-video]:aspect-video [&_.ql-video]:rounded-lg [&_.ql-video]:shadow-md [&_.ql-video]:my-4 sm:[&_.ql-video]:my-6
                                  [&_li_strong]:text-foreground [&_li_strong]:font-medium
                                  [&_span.ql-ui]:hidden
                                  prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-orange-50"
                                dangerouslySetInnerHTML={{ __html: showFullContent || !shouldTruncate ? (donasiData.content || "") : truncateHtmlWords(donasiData.content || "", 100) }}
                            />
                            {/* Overlay modern */}
                            {shouldTruncate && !showFullContent && (
                                <>
                                    <div className="absolute bottom-0 left-0 w-full h-10 bg-white opacity-95 pointer-events-none rounded-b-lg" />
                                    <div className="absolute bottom-0 left-0 w-full z-10 cursor-pointer">
                                        <div onClick={() => setShowFullContent(true)}>
                                            Baca Selengkapnya
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 sticky top-20 self-start">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <CardTitle>Donasi Terkumpul</CardTitle>
                                    {donasiData.status === 'closed' && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M4 4L8 8M8 4L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                            Ditutup
                                        </div>
                                    )}
                                </div>
                                <CardDescription className="text-3xl font-bold text-orange-500">Rp {donasiData.current_amount.toLocaleString('id-ID')}</CardDescription>
                                <span className="text-sm text-gray-500">Dari: Rp {donasiData.target_amount.toLocaleString('id-ID')}</span>
                            </CardHeader>
                            <CardContent>
                                <Progress value={progress} className="h-2" />
                                <div className="flex justify-around text-center mt-4 p-4 border-2 border-orange-400 rounded-lg bg-white">
                                    <div>
                                        <p className="font-bold text-lg">{donasiData.donations || 0}</p>
                                        <p className="text-xs text-gray-500">Donatur</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{donasiData.share || 0}</p>
                                        <p className="text-xs text-gray-500">Dibagikan</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{daysLeft}</p>
                                        <p className="text-xs text-gray-500">Hari Lagi</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-3 w-full">
                                <Button
                                    onClick={handleOpenModal}
                                    className={`font-semibold py-3 px-6 rounded-lg flex-1 transition-all duration-200 shadow-md hover:shadow-lg ${donasiData?.status === 'closed'
                                        ? 'bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                                        }`}
                                    disabled={donasiData?.status === 'closed'}
                                >
                                    {donasiData?.status === 'closed' ? 'Donasi Ditutup' : 'Donasi Sekarang'}
                                </Button>
                                <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 font-medium py-3 px-6 rounded-lg flex-1 transition-all duration-200">
                                    Bagikan
                                </Button>
                            </CardFooter>
                            <CardFooter className="flex gap-3 w-full">
                                <div className="flex items-center gap-2">
                                    <Image src={logo} alt="donasi" className="rounded-full w-12 h-12" />
                                    <span className="text-md">Jakarta Mengabdi</span>
                                </div>
                            </CardFooter>
                            <CardFooter className="flex flex-col justify-start items-start gap-3 w-full">
                                <div className="flex gap-3 border-b border-gray-200 mb-2">
                                    <button
                                        type="button"
                                        className={`text-sm px-4 py-2 font-semibold transition-all duration-200 focus:outline-none relative cursor-pointer
                                            ${activeTab === 'deskripsi' ?
                                                'text-orange-600 border-b-4 border-orange-500 shadow-[0_2px_8px_-2px_rgba(255,145,0,0.10)] bg-transparent' :
                                                'text-gray-500 hover:text-orange-500 border-b-4 border-transparent bg-transparent'}`}
                                        onClick={() => setActiveTab('deskripsi')}
                                    >
                                        Deskripsi
                                    </button>
                                    <button
                                        type="button"
                                        className={`text-sm px-4 py-2 font-semibold transition-all duration-200 focus:outline-none relative cursor-pointer
                                            ${activeTab === 'doa' ?
                                                'text-orange-600 border-b-4 border-orange-500 shadow-[0_2px_8px_-2px_rgba(255,145,0,0.10)] bg-transparent' :
                                                'text-gray-500 hover:text-orange-500 border-b-4 border-transparent bg-transparent'}`}
                                        onClick={() => setActiveTab('doa')}
                                    >
                                        Doa ({prayers.length})
                                    </button>

                                    <button
                                        type="button"
                                        className={`text-sm px-4 py-2 font-semibold transition-all duration-200 focus:outline-none relative cursor-pointer
                                            ${activeTab === 'dukungan' ?
                                                'text-orange-600 border-b-4 border-orange-500 shadow-[0_2px_8px_-2px_rgba(255,145,0,0.10)] bg-transparent' :
                                                'text-gray-500 hover:text-orange-500 border-b-4 border-transparent bg-transparent'}`}
                                        onClick={() => setActiveTab('dukungan')}
                                    >
                                        Dukungan ({recentDonors.length})
                                    </button>
                                </div>
                                {/* Konten tab */}
                                {activeTab === 'deskripsi' && (
                                    <p className="text-md text-gray-700">{donasiData.description}</p>
                                )}
                                {activeTab === 'doa' && (
                                    <div className="flex flex-col items-center justify-center w-full text-md text-gray-700 mb-4 gap-2">
                                        {loadingPrayers ? (
                                            <span>Loading...</span>
                                        ) : prayers.length === 0 ? (
                                            <>
                                                {/* SVG Amplop untuk empty state doa */}
                                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="64" height="64" rx="16" fill="#FFF7ED" />
                                                    <path d="M16 24C16 22.8954 16.8954 22 18 22H46C47.1046 22 48 22.8954 48 24V40C48 41.1046 47.1046 42 46 42H18C16.8954 42 16 41.1046 16 40V24Z" stroke="#FFA726" strokeWidth="2" />
                                                    <path d="M16 24L32 36L48 24" stroke="#FFA726" strokeWidth="2" />
                                                </svg>
                                                <span className="text-center">Belum ada doa dari donatur.</span>
                                            </>
                                        ) : (
                                            <div className="w-full flex flex-col gap-4">
                                                {prayers.map((pr, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-4 border rounded-lg bg-orange-50">
                                                        {pr.photo_url ? (
                                                            <img src={pr.photo_url} alt={pr.name} className="w-10 h-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">{pr.name?.charAt(0) || '?'}</div>
                                                        )}
                                                        <div>
                                                            <div className="font-semibold">{pr.name}</div>
                                                            <div className="text-xs text-gray-500 mb-1">{pr.created_at ? format(new Date(pr.created_at), 'dd MMMM yyyy, HH:mm', { locale: id }) : ''}</div>
                                                            <div className="italic">{pr.prayer}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'dukungan' && (
                                    <div className="w-full mt-4">
                                        <CardTitle className="mb-2">Dukungan dari Donatur</CardTitle>
                                        {loadingDonors ? (
                                            <span>Loading...</span>
                                        ) : recentDonors.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center w-full gap-2">
                                                {/* SVG Hati untuk empty state dukungan */}
                                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="64" height="64" rx="16" fill="#FFF7ED" />
                                                    <path d="M32 48C32 48 14 36.36 14 25.5C14 19.701 18.701 15 24.5 15C28.09 15 31.09 17.09 32 19.09C32.91 17.09 35.91 15 39.5 15C45.299 15 50 19.701 50 25.5C50 36.36 32 48 32 48Z" stroke="#FFA726" strokeWidth="2" />
                                                </svg>
                                                <span className="text-gray-500 text-sm text-center">Belum ada donasi.</span>
                                            </div>
                                        ) : (
                                            recentDonors.map((donor, index) => (
                                                <div key={index}>
                                                    <div className="flex items-center gap-4 py-2">
                                                        {donor.photo_url ? (
                                                            <img src={donor.photo_url} alt={donor.name} className="w-10 h-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                                                {donor.name?.charAt(0) || '?'}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-semibold">{donor.name}</p>
                                                            <p className="text-sm text-gray-500">Ikut donasi Rp {formatIDR(Number(donor.amount))}</p>
                                                        </div>
                                                    </div>
                                                    {index < recentDonors.length - 1 && <Separator />}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="transition-all duration-300">
                    <form onSubmit={handleSubmitPrice} className="flex flex-col gap-4">
                        <DialogHeader>
                            <DialogTitle className="text-center text-xl font-bold mb-2">Pilih Nominal Donasi</DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-4 justify-center mb-2">
                            <label className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${donationMode === 'preset' ? 'bg-orange-100 text-orange-600 border border-orange-400' : 'bg-gray-100 text-gray-500'}`}>
                                <input
                                    type="radio"
                                    name="donationMode"
                                    value="preset"
                                    checked={donationMode === 'preset'}
                                    onChange={() => setDonationMode('preset')}
                                    className="hidden"
                                /> Pilih Nominal
                            </label>
                            <label className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${donationMode === 'manual' ? 'bg-orange-100 text-orange-600 border border-orange-400' : 'bg-gray-100 text-gray-500'}`}>
                                <input
                                    type="radio"
                                    name="donationMode"
                                    value="manual"
                                    checked={donationMode === 'manual'}
                                    onChange={() => setDonationMode('manual')}
                                    className="hidden"
                                /> Input Manual
                            </label>
                        </div>
                        {donationMode === 'preset' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                                {presetOptions.map(opt => (
                                    <Button
                                        type="button"
                                        key={opt}
                                        className={`w-full py-3 rounded-lg font-semibold shadow-sm border transition-all duration-150
                                            ${price === opt ? 'bg-orange-500 text-white border-orange-500 scale-105 hover:bg-orange-600' : 'bg-white border-gray-300 hover:bg-orange-50 hover:border-orange-400 text-orange-500'}`}
                                        onClick={() => setPrice(opt)}
                                    >
                                        Rp {formatIDR(opt)}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Banknote className="text-orange-400 w-5 h-5" /> Nominal Donasi
                                </label>
                                <Input
                                    type="text"
                                    min={1000}
                                    required
                                    value={formatIDR(price)}
                                    onChange={e => {
                                        const raw = getRawNumberFromIDR(e.target.value);
                                        setPrice(Number(raw));
                                    }}
                                    className="border-2 border-orange-200 focus:border-orange-400 focus:ring-orange-200 rounded-lg px-4 py-2 text-lg font-semibold"
                                    placeholder="Masukkan nominal (Rp)"
                                />
                                <span className="text-xs text-gray-400">Minimal Rp 10.000</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 my-2">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">atau</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <DialogFooter className="mt-2 flex-row gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="w-1/2">Batal</Button>
                            </DialogClose>
                            <Button type="submit" className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-150">Donasi</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={showPrayerModal} onOpenChange={setShowPrayerModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim Doa untuk Penerima Donasi</DialogTitle>
                    </DialogHeader>
                    <Textarea value={prayer} onChange={e => setPrayer(e.target.value)} placeholder="Tulis doa terbaikmu..." />
                    <DialogFooter>
                        <Button onClick={handleSubmitPrayer} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-150">Kirim Doa</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal untuk status closed */}
            <Dialog open={showClosedModal} onOpenChange={setShowClosedModal}>
                <DialogContent className="transition-all duration-300">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold mb-2 flex items-center justify-center gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="12" fill="#FEF3C7" />
                                <path d="M12 8V12M12 16H12.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Donasi Sudah Ditutup
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-4">
                        <div className="mb-4">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="64" height="64" rx="16" fill="#FEF3C7" />
                                <path d="M32 16C23.164 16 16 23.164 16 32C16 40.836 23.164 48 32 48C40.836 48 48 40.836 48 32C48 23.164 40.836 16 32 16ZM32 44C25.373 44 20 38.627 20 32C20 25.373 25.373 20 32 20C36.418 20 40 23.582 40 28H36C36 25.791 34.209 24 32 24C29.791 24 28 25.791 28 28C28 30.209 29.791 32 32 32C33.105 32 34 32.895 34 34V36H30V34C30 31.791 28.209 30 26 30H24C24 32.209 25.791 34 28 34V36C25.791 36 24 37.791 24 40H28C28 38.895 28.895 38 30 38H32C34.209 38 36 39.791 36 42H40C40 38.686 36.314 36 32 36V44Z" fill="#F59E0B" />
                            </svg>
                        </div>
                        <p className="text-gray-700 mb-2 font-medium">
                            Maaf, donasi "{donasiData?.title}" sudah ditutup.
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                            Periode penggalangan dana untuk donasi ini telah berakhir.
                            Anda masih dapat melihat detail donasi dan doa-doa yang telah dikirimkan.
                        </p>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Total Terkumpul:</span>
                                <span className="font-bold text-orange-600">Rp {donasiData?.current_amount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                                <span className="text-gray-600">Target:</span>
                                <span className="font-bold text-gray-700">Rp {donasiData?.target_amount.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex-row gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full">Tutup</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
