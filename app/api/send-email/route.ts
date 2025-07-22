import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, nama } = await req.json();

    // Validasi data
    if (!to || !nama) {
      return NextResponse.json({ ok: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: "noreply@yoorent.com",
      to,
      subject: "Selamat Datang di YooRent!",
      html: `
        <h2>Halo ${nama},</h2>
        <p>Terima kasih sudah daftar di <b>YooRent</b>.<br>
        Akun kamu sudah berhasil dibuat. Selamat mencoba layanan kami!</p>
        <hr>
        <small>Jangan balas email ini. Tim YooRent</small>
      `,
    });

    if (result.error) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Terjadi error" }, { status: 500 });
  }
}
