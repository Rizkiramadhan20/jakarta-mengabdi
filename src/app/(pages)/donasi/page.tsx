
import React, { Fragment } from 'react';

import { fetchDonasiData } from "@/lib/FetchDonasi"

import { fetchKakakSakuData } from "@/lib/FetchKakakSaku"

import DonasiSkeleton from '@/hooks/pages/donasi/DonasiSkeleton';

import { Metadata } from 'next';

import { donasiMetadata } from '@/hooks/pages/donasi/meta/Metadata';

import DonasiLayout from '@/hooks/pages/donasi/DonasiLayout'

import KakaSakuLayout from '@/hooks/pages/kakasaku/KakaSakuLayout';

export const metadata: Metadata = donasiMetadata;

export default async function Page() {
    try {
        const donasiData = await fetchDonasiData();
        const kakaSakuData = await fetchKakakSakuData();

        return <Fragment>
            <KakaSakuLayout kakaSakuData={kakaSakuData} />
            <DonasiLayout donasiData={donasiData} />
        </Fragment>;
    } catch (error) {
        return (
            <DonasiSkeleton />
        );
    }
}