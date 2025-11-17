import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import User from "@/models/User"
import connectDB from '@/db/connectDB'

// 🔥 You MUST create and export this
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDB();

      const currentuser = await User.findOne({ email: user.email });
      if (!currentuser) {
        await User.create({
          email: user.email,
          username: user.email.split("@")[0]
        });
      }

      return true;
    },

    async session({ session }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email });
      return session;
    }
  }
};

// 👇 Pass authOptions to NextAuth()
const handler = NextAuth(authOptions);

// 🚀 Export handlers
export { handler as GET, handler as POST };
