"use client";

import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { ChevronRight } from "lucide-react"

interface DonasiTransaction {
    id: string;
    order_id: string;
    donasi_id: number;
    name: string;
    email: string;
    photo_url?: string;
    image_url: string;
    amount: number;
    status: string;
    payment_type?: string;
    transaction_time?: string;
    midtrans_response?: string;
    created_at?: string;
}

interface KakasakuTransaction {
    id: string;
    order_id: string;
    kaka_saku_id: number;
    name: string;
    email: string;
    photo_url?: string;
    image_url: string;
    amount: number;
    status: string;
    payment_type?: string;
    transaction_time?: string;
    midtrans_response?: string;
    created_at?: string;
}

function getMonthYear(dateStr?: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthShort(dateStr: string) {
    // dateStr: '2024-06' => 'Jun'
    const [year, month] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleString('default', { month: 'short' });
}

export default function KaksakuDonasiRekap() {
    const [donasi, setDonasi] = useState<DonasiTransaction[]>([]);
    const [kakasaku, setKakasaku] = useState<KakasakuTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [donasiRes, kakasakuRes] = await Promise.all([
                (await import('@/utils/supabase/supabase')).supabase
                    .from(process.env.NEXT_PUBLIC_DONASI_TRANSACTION as string)
                    .select('*'),
                (await import('@/utils/supabase/supabase')).supabase
                    .from(process.env.NEXT_PUBLIC_KAKASAKU_TRANSACTION as string)
                    .select('*'),
            ]);
            setDonasi(donasiRes.data || []);
            setKakasaku(kakasakuRes.data || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    // Aggregate totals
    const totalDonasi = donasi.reduce((sum, trx) => sum + (trx.amount || 0), 0);
    const totalKakasaku = kakasaku.reduce((sum, trx) => sum + (trx.amount || 0), 0);
    const countDonasi = donasi.length;
    const countKakasaku = kakasaku.length;

    // Monthly aggregation for chart
    function aggregateMonthly(data: { transaction_time?: string; amount: number }[]) {
        const map: Record<string, number> = {};
        data.forEach(trx => {
            const key = getMonthYear(trx.transaction_time);
            if (!key) return;
            map[key] = (map[key] || 0) + (trx.amount || 0);
        });
        return map;
    }
    const donasiMonthly = aggregateMonthly(donasi);
    const kakasakuMonthly = aggregateMonthly(kakasaku);

    // Cari rentang bulan dari data
    function getMonthRange(...allDates: string[]): string[] {
        if (allDates.length === 0) return [];
        const months = allDates
            .map(getMonthYear)
            .filter(Boolean)
            .sort();
        if (months.length === 0) return [];
        const start = months[0];
        const end = months[months.length - 1];
        // Generate all months between start and end
        const [startY, startM] = start.split('-').map(Number);
        const [endY, endM] = end.split('-').map(Number);
        const result: string[] = [];
        let y = startY, m = startM;
        while (y < endY || (y === endY && m <= endM)) {
            result.push(`${y}-${String(m).padStart(2, '0')}`);
            m++;
            if (m > 12) { m = 1; y++; }
        }
        return result;
    }
    const allDates = [
        ...donasi.map(d => d.transaction_time || ''),
        ...kakasaku.map(k => k.transaction_time || ''),
    ];
    const allMonths = getMonthRange(...allDates);
    // Map ke format chartData yang diinginkan
    const chartData = allMonths.map(month => ({
        month: getMonthShort(month),
        donasi: donasiMonthly[month] || 0,
        kakasaku: kakasakuMonthly[month] || 0,
    }));

    // Chart config
    const chartConfig = {
        donasi: {
            label: 'Donasi',
            color: '#22c55e',
        },
        kakasaku: {
            label: 'Kaka Saku',
            color: '#3b82f6',
        },
    };

    let chartDataFixed = [...chartData];
    if (chartDataFixed.length === 1) {
        // Tambahkan bulan sebelum/berikutnya dengan nilai 0
        chartDataFixed = [
            { month: 'Jun', donasi: 0, kakasaku: 0 },
            ...chartDataFixed,
        ];
    }

    return (
        <section className="space-y-6 sm:space-y-8">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 sm:p-5 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-3 sm:gap-4'>
                <div className='flex flex-col gap-2 sm:gap-3'>
                    <h3 className='text-xl sm:text-2xl md:text-3xl font-bold break-words'>
                        Manajemen Rekaputasi Kakasaku & Donasi
                    </h3>
                    <ol className='flex flex-wrap gap-1 sm:gap-2 items-center text-xs sm:text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Rekaputasi</span>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Card className="rounded-3xl border-0 bg-gradient-to-br from-green-50 to-white min-w-0">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <div className="bg-green-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /></svg>
                        </div>
                        <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-green-700">Total Donasi</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 relative min-h-[80px]">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-600 mb-1">Rp {totalDonasi.toLocaleString()}</div>
                        <div className="text-muted-foreground text-xs sm:text-base absolute right-4 bottom-4 md:right-6 md:bottom-4">{countDonasi} transaksi</div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-white min-w-0">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /></svg>
                        </div>
                        <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-blue-700">Total Kaka Saku</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 relative min-h-[80px]">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">Rp {totalKakasaku.toLocaleString()}</div>
                        <div className="text-muted-foreground text-xs sm:text-base absolute right-4 bottom-4 md:right-6 md:bottom-4">{countKakasaku} transaksi</div>
                    </CardContent>
                </Card>
            </div>
            <Card className="rounded-3xl border-0 bg-gradient-to-br from-slate-50 to-white min-w-0">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <div className="bg-slate-200 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" /></svg>
                    </div>
                    <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-slate-700">Grafik Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full min-h-[220px] sm:min-h-[250px] overflow-x-auto">
                        <div className="min-w-[320px] sm:min-w-0">
                            <ChartContainer config={chartConfig} className="min-h-[220px] sm:min-h-[250px] w-full">
                                <AreaChart data={chartDataFixed.length ? chartDataFixed : [
                                    { month: 'Jan', donasi: 0, kakasaku: 0 },
                                    { month: 'Feb', donasi: 0, kakasaku: 0 },
                                ]}>
                                    <defs>
                                        <linearGradient id="fillDonasi" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={1.0} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="fillKakasaku" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={20}
                                        fontSize={12}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(value) => value}
                                                indicator="dot"
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey="donasi"
                                        type="natural"
                                        fill="url(#fillDonasi)"
                                        stroke="#22c55e"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="kakasaku"
                                        type="natural"
                                        fill="url(#fillKakasaku)"
                                        stroke="#3b82f6"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {loading && <div className="text-center text-sm py-2">Loading...</div>}
        </section>
    );
}
