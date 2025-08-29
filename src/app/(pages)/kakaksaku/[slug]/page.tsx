import type { Metadata } from 'next'

import KakasakuDetailsContent from '@/hooks/pages/kakasaku/slug/KakaksakuDetailsContent'

import { generateMetadata as getKakaSakuMetadata } from '@/hooks/pages/kakasaku/slug/meta/Metadata'

import { fetchKakaSakuBySlug } from "@/lib/FetchKakakSaku"

import KakasakuSlugSkeleton from '@/hooks/pages/kakasaku/slug/KakasakuSlugSkeleton';

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
            <KakasakuDetailsContent
                kakaSakuData={kakaSakuData}
            />
        );
    } catch (error) {
        return (
            <KakasakuSlugSkeleton />
        );
    }
}