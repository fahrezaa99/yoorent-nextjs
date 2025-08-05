// /app/api/ocr-ktp/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const ext = file.name.split(".").pop() || "jpg";
  const ocrForm = new FormData();
  ocrForm.append("apikey", "helloworld"); // Demo API key. Daftar gratis di ocr.space buat produksi!
  ocrForm.append("language", "ind");
  ocrForm.append("file", new Blob([buffer]), `ktp.${ext}`);

  const resp = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: ocrForm as any,
  });
  const data = await resp.json();
  return NextResponse.json({
    ocrText: data?.ParsedResults?.[0]?.ParsedText ?? "",
    raw: data,
  });
}
