"use client"

import { useEffect, useState } from 'react';

import { useSearchParams, useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

import Image from 'next/image';

import successImg from '@/base/assets/banner.png';

import pendingImg from '@/base/assets/banner.png';

import { useAuth } from '@/utils/context/AuthContext';

interface Transaction {
    id?: number;
    order_id: string;
    name: string;
    email: string;
    photo_url?: string;
    image_url?: string;
    amount: number;
    status: string;
    payment_type?: string;
    transaction_time?: string;
}

interface Prayer {
    id?: number;
    name: string;
    email: string;
    photo_url?: string;
    prayer: string;
    created_at?: string;
}

export default function TransactionStatusPage() {
    const params = useSearchParams();
    const router = useRouter();
    const { slug } = useParams() as { slug: string };
    const status = params.get('status');
    const { user } = useAuth();
    const userEmail = user?.email;

    const [kakaSakuId, setKakaSakuId] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [loading, setLoading] = useState(true);

    // Ambil id dari slug
    useEffect(() => {
        async function fetchId() {
            const res = await fetch(`/api/kakasaku/${slug}`, {
                headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}` },
            });
            const data = await res.json();
            if (data && data.id) setKakaSakuId(data.id);
        }
        fetchId();
    }, [slug]);

    // Fetch transactions & prayers
    useEffect(() => {
        if (!kakaSakuId) return;
        setLoading(true);
        Promise.all([
            fetch(`/api/kakasaku/insert-transaction?kaka_saku_id=${kakaSakuId}`, {
                headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}` },
            }).then(res => res.json()),
            fetch(`/api/kakasaku/prayer?kaka_saku_id=${kakaSakuId}`, {
                headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}` },
            }).then(res => res.json()),
        ]).then(([trx, doa]) => {
            setTransactions(trx.transactions || []);
            setPrayers(doa.prayers || []);
            setLoading(false);
        });
    }, [kakaSakuId]);

    const filteredTransactions = transactions.filter(trx => trx.email === userEmail);
    const filteredPrayers = prayers.filter(pr => pr.email === userEmail);

    let title = '';
    let desc = '';
    let img = successImg;
    if (status === 'success') {
        title = 'Transaksi Berhasil!';
        desc = 'Terima kasih, donasi Anda sudah berhasil. Semoga menjadi berkah.';
        img = successImg;
    } else if (status === 'pending') {
        title = 'Transaksi Pending';
        desc = 'Pembayaran Anda sedang diproses. Silakan cek status secara berkala.';
        img = pendingImg;
    } else {
        title = 'Status Tidak Diketahui';
        desc = 'Status transaksi tidak ditemukan.';
        img = pendingImg;
    }

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4 py-28">
            <div className="container w-full flex flex-col gap-10">
                <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center mb-4 border border-orange-100">
                    <Image src={img} alt={title} width={160} height={100} className="mb-6 rounded-xl shadow-sm" />
                    <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-900 tracking-tight">{title}</h1>
                    <p className="text-gray-500 mb-8 text-center text-lg max-w-md">{desc}</p>
                    <Button onClick={() => router.push('/profile/kakasaku/kakasaku')} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 py-3 shadow transition-all w-full max-w-xs">Lihat Riwayat Transaksi</Button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 w-full border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Semua Transaksi</h2>
                    {loading ? (
                        <div className="flex justify-center items-center py-8"><span className="animate-pulse text-orange-400 font-semibold">Loading...</span></div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-gray-400 text-center py-8">Tidak ada transaksi.</div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {filteredTransactions.map((trx, idx) => (
                                <div key={idx} className="group border border-gray-100 rounded-xl p-5 flex items-center gap-5 bg-gray-50 hover:bg-orange-50 transition-shadow shadow-sm hover:shadow-md cursor-pointer">
                                    {trx.photo_url ? (
                                        <img src={trx.photo_url} alt={trx.name} className="w-12 h-12 rounded-full object-cover shadow" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-500 text-xl shadow">{trx.name?.charAt(0) || '?'}</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">{trx.name}</div>
                                        <div className="text-xs text-gray-400 mb-1">{trx.transaction_time ? new Date(trx.transaction_time).toLocaleString() : ''}</div>
                                        <div className="text-base text-orange-600 font-bold">Donasi Rp {trx.amount?.toLocaleString('id-ID')}</div>
                                        <div className="text-xs text-gray-500 mt-1">Status: <span className={trx.status === 'success' ? 'text-green-500' : trx.status === 'pending' ? 'text-yellow-500' : 'text-gray-400'}>{trx.status}</span></div>
                                    </div>
                                    {trx.image_url && <img src={trx.image_url} alt="img" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 w-full border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Semua Doa</h2>
                    {loading ? (
                        <div className="flex justify-center items-center py-8"><span className="animate-pulse text-orange-400 font-semibold">Loading...</span></div>
                    ) : filteredPrayers.length === 0 ? (
                        <div className="text-gray-400 text-center py-8">Tidak ada doa.</div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {filteredPrayers.map((pr, idx) => (
                                <div key={idx} className="group border border-gray-100 rounded-xl p-5 flex items-center gap-5 bg-gray-50 hover:bg-orange-50 transition-shadow shadow-sm hover:shadow-md cursor-pointer">
                                    {pr.photo_url ? (
                                        <img src={pr.photo_url} alt={pr.name} className="w-12 h-12 rounded-full object-cover shadow" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-500 text-xl shadow">{pr.name?.charAt(0) || '?'}</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">{pr.name}</div>
                                        <div className="text-xs text-gray-400 mb-1">{pr.created_at ? new Date(pr.created_at).toLocaleString() : ''}</div>
                                        <div className="italic text-gray-700">{pr.prayer}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
} 