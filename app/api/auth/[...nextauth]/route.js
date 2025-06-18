import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this logic with your own (e.g., database query)
        const user = {
          id: "1",
          name: "John Doe",
          email: process.env.SIGNIN_USER_EMAIL,
        };

        if (
          credentials.email === user.email &&
          credentials.password === process.env.SIGNIN_USER_PASSWORD
        ) {
          return user; // Return user object on successful authentication
        }

        return null; // Return null if authentication fails
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
