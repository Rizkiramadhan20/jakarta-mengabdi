
import React from 'react';

import { fetchVolunteerData } from "@/lib/FetchVolunteer"

import DonasiSkeleton from '@/hooks/pages/donasi/DonasiSkeleton';

import { Metadata } from 'next';

import VolunteerLayout from '@/hooks/pages/volunteer/VolunteerLayout';

export const metadata: Metadata = {
    title: 'Jakarta Mengabdi - Volunteer',
    description: 'Explore our collection of visual works and creative projects at Sunik Yohan',
    keywords: 'gallery, visual works, creative projects, Sunik Yohan',
    openGraph: {
        title: 'Gallery | Sunik Yohan',
        description: 'Explore our collection of visual works and creative projects at Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/gallery.png', // Make sure to add this image to your public folder
                width: 1200,
                height: 630,
                alt: 'Sunik Yohan Gallery',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gallery | Sunik Yohan',
        description: 'Explore our collection of visual works and creative projects at Sunik Yohan',
        images: ['/public/gallery.png'], // Same image as OpenGraph
    },
};

export default async function Page() {
    try {
        const volunterData = await fetchVolunteerData();

        return (
            <VolunteerLayout volunterData={volunterData} />
        )
    } catch (error) {
        console.error('Error fetching Donasi data:', error);
        return (
            <DonasiSkeleton />
        );
    }
}