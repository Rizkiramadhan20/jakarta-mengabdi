"use client"

import { KakaSaku } from '@/interface/kakaSaku'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';

import { Separator } from '@/components/ui/separator';

import Image from 'next/image';

import { useState, useMemo, useEffect } from 'react';

import logo from '@/base/assets/Ellipse.png'

import { useAuth } from '@/utils/context/AuthContext';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

import { formatIDR, getRawNumberFromIDR } from '@/base/helper/FormatPrice';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { supabase } from '@/utils/supabase/supabase';

import { Input } from '@/components/ui/input';

import { Button as UIButton } from '@/components/ui/button';

import { Banknote } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';

import { format } from 'date-fns';

import { id } from 'date-fns/locale';

interface KakasakuDetailsContentProps {
    kakaSakuData: KakaSaku | null;
}

export default function KakasakuDetailsContent({ kakaSakuData }: KakasakuDetailsContentProps) {
    const { profile } = useAuth();
    const router = useRouter();

    // Get unique timeline types for filter options (excluding 'all')
    const timelineTypes = useMemo(() => {
        const types = kakaSakuData?.timeline?.map(item => item.type) || [];
        return Array.from(new Set(types));
    }, [kakaSakuData?.timeline]);

    const [selectedType, setSelectedType] = useState<string>(timelineTypes[0] || '');
    const [showModal, setShowModal] = useState(false);
    const [price, setPrice] = useState<number>(10000); // default 10.000
    const [recentDonors, setRecentDonors] = useState<any[]>([]);
    const [donationMode, setDonationMode] = useState<'manual' | 'preset'>('preset');
    const presetOptions = [10000, 25000, 50000, 100000, 150000];
    const [activeTab, setActiveTab] = useState<'deskripsi' | 'doa' | 'dukungan'>('deskripsi');
    const [prayers, setPrayers] = useState<any[]>([]);
    const [loadingPrayers, setLoadingPrayers] = useState(false);
    const [showPrayerModal, setShowPrayerModal] = useState(false);
    const [prayer, setPrayer] = useState("");

    // Ambil recent donors dari Supabase
    useEffect(() => {
        const fetchRecentDonors = async () => {
            if (!kakaSakuData?.id) return;
            const { data, error } = await supabase
                .from('kakasaku_transactions')
                .select('name, amount, photo_url')
                .eq('kaka_saku_id', Number(kakaSakuData.id))
                .order('transaction_time', { ascending: false })
                .limit(5);
            if (!error && data) setRecentDonors(data);
        };
        fetchRecentDonors();
    }, [kakaSakuData?.id]);

    useEffect(() => {
        async function fetchPrayers() {
            if (!kakaSakuData?.id) return;
            setLoadingPrayers(true);
            const res = await fetch(`/api/kakasaku/prayer?kaka_saku_id=${kakaSakuData.id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
                },
            });
            const data = await res.json();
            setPrayers(data.prayers || []);
            setLoadingPrayers(false);
        }
        fetchPrayers();
    }, [kakaSakuData?.id]);

    const handleOpenModal = () => {
        if (!profile) {
            toast.error('Anda harus login untuk melakukan donasi.');
            setTimeout(() => {
                router.push('/signin');
            }, 1000);
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
        if (!kakaSakuData) return;
        const order_id = result.order_id || `KAKASAKU-${kakaSakuData.id}-${Date.now()}`;
        const name = profile?.full_name || 'Donatur';
        const email = profile?.email || 'donatur@email.com';
        const photo_url = profile?.photo_url || null;
        const gross_amount = result.gross_amount || price;
        await fetch('/api/kakasaku/insert-transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id,
                kaka_saku_id: kakaSakuData.id,
                name,
                email,
                photo_url,
                amount: gross_amount,
                status,
                payment_type: result.payment_type,
                transaction_time: (result as any).transaction_time || new Date().toISOString(),
                midtrans_response: result,
            }),
        });
    };

    const handleDonate = async (gross_amount: number) => {
        if (!kakaSakuData) return;
        const order_id = `KAKASAKU-${kakaSakuData.id}-${Date.now()}`;
        const name = profile?.full_name || 'Donatur';
        const email = profile?.email || 'donatur@email.com';
        const photo_url = profile?.photo_url || null;

        const res = await fetch('/api/kakasaku/payment', {
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
                    setShowPrayerModal(true);
                },
                onPending: async function (result) {
                    await insertTransaction(result, 'pending');
                    toast('Pembayaran Anda sedang diproses');
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
        if (!kakaSakuData) return;
        await fetch('/api/kakasaku/prayer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                kaka_saku_id: kakaSakuData.id,
                name: profile?.full_name,
                email: profile?.email,
                photo_url: profile?.photo_url,
                prayer,
            }),
        });
        setShowPrayerModal(false);
        setPrayer("");
        window.location.href = `/kakaksaku/${kakaSakuData.slug}?success=1`;
    };

    if (!kakaSakuData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Data Tidak Ditemukan</h1>
                    <p className="text-gray-600">KakaSaku yang Anda cari tidak ditemukan.</p>
                </div>
            </div>
        );
    }

    const daysLeft = kakaSakuData.deadline ? Math.ceil((new Date(kakaSakuData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30;
    const progress = (kakaSakuData.current_amount / kakaSakuData.target_amount) * 100;

    // Filter timeline based on selected type
    const filteredTimeline = useMemo(() => {
        if (!selectedType) {
            return kakaSakuData.timeline;
        }
        return kakaSakuData.timeline.filter(item => item.type === selectedType);
    }, [kakaSakuData.timeline, selectedType]);

    return (
        <section className="py-24">
            <div className="container px-4 md:px-8">
                <div className="text-sm text-gray-500 mb-4">
                    Beranda &gt; KakaSaku &gt; {kakaSakuData.title}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 flex flex-col space-y-4">
                        {kakaSakuData.image_url && (
                            <Image
                                src={Array.isArray(kakaSakuData.image_url) ? kakaSakuData.image_url[0] : kakaSakuData.image_url}
                                alt={kakaSakuData.title}
                                className="w-full h-auto object-cover rounded-lg mb-6"
                                width={1000}
                                height={1000}
                            />
                        )}
                        <h1 className="text-3xl font-bold text-gray-800">Yuk Jadi Kakak Saku! Tabung Kebaikan, Tebar Manfaat ✨</h1>

                        {/* Timeline Filter */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center gap-2 p-6 border-2 border-orange-400 rounded-lg bg-white z-50 relative overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                                {timelineTypes.map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setSelectedType(selectedType === type ? '' : type)}
                                        className={`${selectedType === type ? "font-bold" : ""} text-md cursor-pointer whitespace-nowrap px-3 py-1`}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline Display */}
                        <div className="flex justify-between items-center -mt-6 z-10 relative">
                            {
                                filteredTimeline.map((item, idx) => {
                                    return (
                                        <div key={idx} className="flex items-center gap-2">
                                            {item.image_url && (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.type}
                                                    width={1000}
                                                    height={1000}
                                                    className="object-cover rounded"
                                                />
                                            )}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 sticky top-24 self-start">
                        <Card>
                            <CardHeader>
                                <CardTitle className="mb-2">Dana Terkumpul</CardTitle>
                                <CardDescription className="text-3xl font-bold text-orange-500">Rp {kakaSakuData.current_amount.toLocaleString('id-ID')}</CardDescription>

                                <span className="text-sm text-gray-500">Dari: Rp {kakaSakuData.target_amount.toLocaleString('id-ID')}</span>
                            </CardHeader>

                            <CardContent>
                                <Progress value={progress} className="h-2" />

                                <div className="flex justify-around text-center mt-4 p-4 border-2 border-orange-400 rounded-lg bg-white">
                                    <div>
                                        <p className="font-bold text-lg">{kakaSakuData.kakaksaku || 0}</p>
                                        <p className="text-xs text-gray-500">Kakak Saku</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{kakaSakuData.share || 0}</p>
                                        <p className="text-xs text-gray-500">Dibagikan</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{daysLeft}</p>
                                        <p className="text-xs text-gray-500">Hari Lagi</p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex gap-3 w-full">
                                <Button onClick={handleOpenModal} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex-1 transition-all duration-200 shadow-md hover:shadow-lg">
                                    Jadi Kakak Saku
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
                                    <p className="text-md text-gray-700">{kakaSakuData.description}</p>
                                )}
                                {activeTab === 'doa' && (
                                    <div className="flex flex-col items-center justify-center w-full text-md text-gray-700 mb-4 gap-2">
                                        {loadingPrayers ? (
                                            <span>Loading...</span>
                                        ) : prayers.length === 0 ? (
                                            <>
                                                {/* SVG Amplop untuk empty state doa */}
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
                                        <CardTitle className="mb-2">Dukungan dari Kakak Saku</CardTitle>
                                        {recentDonors.length === 0 ? (
                                            <p className="text-gray-500 text-sm">Belum ada donasi.</p>
                                        ) : (
                                            recentDonors.map((donor, index) => (
                                                <div key={index}>
                                                    <div className="flex items-center gap-4 py-2">
                                                        {donor.photo_url ? (
                                                            <img src={donor.photo_url} alt={donor.name} className="w-10 h-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                                                {donor.name.charAt(0)}
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
                                    <UIButton
                                        type="button"
                                        key={opt}
                                        className={`w-full py-3 rounded-lg font-semibold shadow-sm border transition-all duration-150
                                            ${price === opt ? 'bg-orange-500 text-white border-orange-500 scale-105 hover:bg-orange-600' : 'bg-white border-gray-300 hover:bg-orange-50 hover:border-orange-400 text-orange-500'}`}
                                        onClick={() => setPrice(opt)}
                                    >
                                        Rp {formatIDR(opt)}
                                    </UIButton>
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
                                <UIButton type="button" variant="outline" className="w-1/2">Batal</UIButton>
                            </DialogClose>
                            <UIButton type="submit" className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-150">Donasi</UIButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={showPrayerModal} onOpenChange={setShowPrayerModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim Doa untuk Penerima KakaSaku</DialogTitle>
                    </DialogHeader>
                    <Textarea value={prayer} onChange={e => setPrayer(e.target.value)} placeholder="Tulis doa terbaikmu..." />
                    <DialogFooter>
                        <Button onClick={handleSubmitPrayer} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-150">Kirim Doa</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
