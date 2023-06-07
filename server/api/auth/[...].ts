import { NuxtAuthHandler } from '#auth';
import { prisma } from '../../../prisma';
// import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github'

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login'
  },
  // adapter: PrismaAdapter(prisma),
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
     CredentialsProvider.default({
      async authorize(credentials: { username: string; password: string }) {
        const { username, password } = credentials;
        const user = await prisma.user.findUnique({
          where: {
            username
          }
        });
        if(user?.password === password) return user;
        else return null;
      },
    }),
    // @ts-expect-error
    GithubProvider.default({
      clientId: 'a2afc0780d4ab796ecca',
      clientSecret: process.env.AUTH_SECRET
    })
  ],
  callbacks: {
    // @ts-ignore
    jwt: async ({ token, user }) => {
      if(user) token.id = user.id ?? '';
      return Promise.resolve(token);
    },
    // @ts-ignore
    session: async ({ session, token }) => {
      session.uid = token.id;
      return Promise.resolve(session);
    }
  }
});