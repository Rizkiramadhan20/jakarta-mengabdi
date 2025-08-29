import type { Metadata } from 'next'

import ValunteerDetailsContent from '@/hooks/pages/volunteer/slug/ValunteerDetails'

import { generateMetadata as getVolunteerMetadata } from '@/hooks/pages/volunteer/slug/meta/Metadata'

import { fetchVolunteerBySlug } from "@/lib/FetchVolunteer"

import ValunteerSlugSkeleton from '@/hooks/pages/volunteer/slug/ValunteerSlugSkeleton';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const resolvedParams = await params
    return getVolunteerMetadata({ params: { slug: resolvedParams.slug } })
}

export default async function Page({ params }: Props) {
    try {
        const resolvedParams = await params

        const volunteerData = await fetchVolunteerBySlug(resolvedParams.slug)

        return (
            <ValunteerDetailsContent
                volunteerData={volunteerData}
            />
        );
    } catch (error) {
        return (
            <ValunteerSlugSkeleton />
        );
    }
}