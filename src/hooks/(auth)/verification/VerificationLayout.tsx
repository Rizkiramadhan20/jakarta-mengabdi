"use client"

import React from 'react'
import Image from 'next/image'
import { Mail, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from '@/utils/context/AuthContext'
import coffeImage from "@/base/assets/login.png"

export default function VerificationLayout() {
  const { user } = useAuth()

  const handleOpenGmail = () => {
    window.open('https://gmail.com', '_blank')
  }

  return (
    <section className="min-h-screen flex flex-col md:flex-row">
      {/* Kiri: Konten Verifikasi */}
      <div className="order-2 md:order-1 flex flex-col justify-center md:w-1/2 w-full px-8 md:px-24 py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-[#ED8002]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[#ED8002]" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verifikasi Email</h1>
            <p className="text-gray-600">
              Kami telah mengirimkan link verifikasi ke email Anda
            </p>
          </div>

          {/* Card Instruksi */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#ED8002]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#ED8002] text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Cek Email Anda</h3>
                    <p className="text-gray-600 text-sm">
                      Periksa kotak masuk email Anda untuk pesan dari Jakarta Mengabdi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#ED8002]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#ED8002] text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Klik Link Verifikasi</h3>
                    <p className="text-gray-600 text-sm">
                      Klik tombol "Konfirmasi Email" dalam email tersebut
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Selesai!</h3>
                    <p className="text-gray-600 text-sm">
                      Akun Anda akan aktif dan siap digunakan
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Info */}
          {user?.email && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Email dikirim ke:</span>
              </div>
              <p className="text-blue-700 font-medium mt-1">{user.email}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={handleOpenGmail}
              className="w-full bg-[#ED8002] hover:bg-[#ED8002]/90"
            >
              <Mail className="w-4 h-4 mr-2" />
              Buka Gmail
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Tidak menerima email? Periksa folder spam Anda
              </p>
              <a
                href="/signin"
                className="text-[#ED8002] hover:underline text-sm font-medium"
              >
                Kembali ke halaman masuk
              </a>
            </div>
          </div>

          {/* Tips */}
          <Card className="mt-6 bg-gray-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2">💡 Tips:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Cek folder spam/junk jika email tidak masuk</li>
                <li>• Email verifikasi berlaku selama 24 jam</li>
                <li>• Pastikan alamat email yang digunakan benar</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kanan: Gambar */}
      <div className="order-1 md:order-2 mb-4 md:mb-0 flex md:w-1/2 items-center justify-center">
        <div className="relative w-full h-full min-h-[450px] md:min-h-[500px]">
          <Image
            src={coffeImage}
            alt="Verifikasi Email"
            layout="fill"
            objectFit="cover"
            className="rounded-r-3xl"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ED8002]/20 to-transparent rounded-r-3xl" />
          {/* Text overlay */}
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Verifikasi Email Anda</h2>
            <p className="text-white/90">
              Satu langkah lagi untuk bergabung dengan komunitas Jakarta Mengabdi
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
