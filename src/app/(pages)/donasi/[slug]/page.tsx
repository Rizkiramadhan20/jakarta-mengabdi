import type { Metadata } from 'next'

import DonasiDetailsContent from '@/hooks/pages/donasi/slug/DonasiDetailsContent'

import { generateMetadata as getDonasiMetadata } from '@/hooks/pages/donasi/slug/meta/Metadata'

import { fetchDonasiBySlug } from "@/lib/FetchDonasi"

import DonasiSlugSkeleton from '@/hooks/pages/donasi/slug/DonasiSlugSkeleton';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const resolvedParams = await params
    return getDonasiMetadata({ params: { slug: resolvedParams.slug } })
}

export default async function Page({ params }: Props) {
    try {
        const resolvedParams = await params

        const donasiData = await fetchDonasiBySlug(resolvedParams.slug)

        return (
            <DonasiDetailsContent
                donasiData={donasiData}
            />
        );
    } catch (error) {
        console.error('Error fetching donasi data:', error);
        return (
            <DonasiSlugSkeleton />
        );
    }
}