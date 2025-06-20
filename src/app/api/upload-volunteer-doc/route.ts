import { NextRequest, NextResponse } from "next/server";

import { promises as fs } from "fs";

import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  console.log("File from formData:", file);

  if (!file) {
    console.log("No file uploaded");
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (typeof File !== "undefined" && !(file instanceof File)) {
    console.log("Uploaded data is not a File instance:", file);
    return NextResponse.json(
      { error: "Uploaded data is not a file" },
      { status: 400 }
    );
  }

  const arrayBuffer = await (file as File).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Pastikan folder sudah ada
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "volunteer-docs"
  );
  await fs.mkdir(uploadDir, { recursive: true });

  // Simpan file
  const filePath = path.join(uploadDir, (file as File).name);
  await fs.writeFile(filePath, buffer);

  // URL file yang bisa diakses publik
  const publicUrl = `/uploads/volunteer-docs/${(file as File).name}`;

  return NextResponse.json({ url: publicUrl });
}

export async function DELETE(req: NextRequest) {
  // Ambil nama file dari query parameter
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("name");

  if (!fileName) {
    return NextResponse.json(
      { error: "No file name provided" },
      { status: 400 }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "volunteer-docs",
    fileName
  );

  try {
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "File not found or cannot be deleted" },
      { status: 404 }
    );
  }
}
