import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Optional: Custom callbacks, misal untuk debug login Google redirect
  callbacks: {
    async session({ session, token, user }) {
      // Biar session bisa diakses di client, misal tambahan info user
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Pastikan setelah login diarahkan ke dashboard, ubah jika perlu
      // return baseUrl + "/dashboard"; // <--- kalau mau ke dashboard
      return baseUrl; // default ke /
    },
  },
  // Tambahkan secret jika perlu (NEXTAUTH_SECRET)
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
