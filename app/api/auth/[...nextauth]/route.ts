import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Tambah provider lain kalau ada
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // auto redirect ke dashboard setelah login
      return `${baseUrl}/dashboard`;
    },
    // Callback lain jika perlu
  },
  // Session & config lain jika perlu
});

export { handler as GET, handler as POST };
