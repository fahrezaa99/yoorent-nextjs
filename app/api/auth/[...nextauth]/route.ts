import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import provider lain jika ada

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // tambahkan provider lain di sini
  ],

  // Optional: kalau mau custom pages
  // pages: {
  //   signIn: '/login', // custom sign-in page
  //   error: '/login?error=Auth', // custom error
  // },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // SETELAH LOGIN, redirect ke /dashboard (bisa ganti ke mana pun)
      return `${baseUrl}/dashboard`;
    },
    // Boleh tambahkan callback lain jika perlu
    // async session({ session, token, user }) { return session }
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
  },
  
  // session: { ... } // (Opsional, jika kamu custom session/jwt)
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
