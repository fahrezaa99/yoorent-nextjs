import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Tambahkan provider lain di sini kalau ada
  ],
  // Tambahkan config lain di sini (callbacks, dsb.) jika perlu
};

// Handler untuk Next.js App Router API Route
const handler = NextAuth(authOptions);

// HANYA export ini!
export { handler as GET, handler as POST };
