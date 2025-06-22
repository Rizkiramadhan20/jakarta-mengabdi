import type { Metadata } from 'next'

import DonasiDetailsContent from '@/hooks/pages/slug/DonasiDetailsContent'

import { generateMetadata as getKakaSakuMetadata } from '@/hooks/pages/slug/meta/Metadata'

import { fetchKakaSakuBySlug } from "@/lib/FetchKakakSaku"

import DonasiSlugSkeleton from '@/hooks/pages/slug/DonasiSlugSkeleton';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const resolvedParams = await params
    return getKakaSakuMetadata({ params: { slug: resolvedParams.slug } })
}

export default async function Page({ params }: Props) {
    try {
        const resolvedParams = await params

        const kakaSakuData = await fetchKakaSakuBySlug(resolvedParams.slug)

        return (
            <DonasiDetailsContent
                kakaSakuData={kakaSakuData}
            />
        );
    } catch (error) {
        console.error('Error fetching kaka saku data:', error);
        return (
            <DonasiSlugSkeleton />
        );
    }
}