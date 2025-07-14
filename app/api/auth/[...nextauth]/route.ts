import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // or "database" jika pakai DB
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  pages: {
    signIn: "/masuk", // ganti sesuai halaman login kamu
    error: "/masuk", // redirect ke page ini kalau error
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Simpan info Google user ke token
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Tambah info token ke session
      if (token) {
        session.user.id = token.id;
        // Bisa tambahin info lain dari token
      }
      return session;
    },
    // Optional: Redirect user ke halaman dashboard setelah login
    async redirect({ url, baseUrl }) {
      // Biar abis login langsung ke /dashboard (ganti sesuai project)
      if (url.startsWith("/")) return `${baseUrl}/dashboard`;
      return baseUrl;
    },
  },
  // Ini untuk fix cookie di production (khusus domain custom/https)
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // domain: ".yoorent.com", // Optional, tambahkan jika pake custom domain
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
