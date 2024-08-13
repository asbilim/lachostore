import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const auth = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/login/`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();

        if (res.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access;
        token.refreshToken = user.refresh;
      }

      // Decode the access token and add the data to the token object
      if (token.accessToken) {
        const decoded = jwt.decode(token.accessToken);
        token.user_id = decoded.user_id;
        token.username = decoded.username;
        token.email = decoded.email;
        token.id = decoded.id;
      }

      return token;
    },
    async session({ session, token }) {
      // Pass the decoded JWT data and any other user details to the session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user_id = token.user_id;
      session.username = token.username;
      session.email = token.email;
      session.id = token.id;

      return session;
    },
  },
});

export { auth as GET, auth as POST };
