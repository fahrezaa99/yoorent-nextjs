import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// --- NextAuth config
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Tambah AppleProvider, FacebookProvider, dsb DI SINI kalau mau nanti
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  // Optional: bisa tambahkan callbacks, pages, dsb di sini
});

export { handler as GET, handler as POST };
