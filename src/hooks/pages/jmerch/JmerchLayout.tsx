import React from 'react'

import { Category } from "@/interface/products"

import {
    Card
} from "@/components/ui/card"

import Image from 'next/image'

import Link from 'next/link'

import { slugify } from "@/base/helper/slugify"

export default function JmerchLayout({ productcategoryData }: { productcategoryData: Category[] }) {
    return (
        <section className='py-16'>
            <div className="container px-4 md:px-8">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-[#ED8002] lg:text-4xl">Lengkapi koleksimu</h2>
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
                    {productcategoryData.map((item, idx) => {
                        return (
                            <Card
                                key={idx}
                                className="group overflow-hidden rounded-xl border-0 shadow-md transition-all duration-300 p-0"
                            >
                                <Link href={slugify(item.name)} className="relative aspect-square">
                                    <Image
                                        src={item.thumbnail || ""}
                                        alt={item.name}
                                        quality={100}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                                    </div>
                                </Link>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
