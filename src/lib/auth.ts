import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const photographer = await prisma.photographer.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })
        if (!photographer) return null

        const valid = await bcrypt.compare(
          credentials.password,
          photographer.passwordHash
        )
        if (!valid) return null

        return {
          id: photographer.id,
          name: photographer.name,
          email: photographer.email,
          studioName: photographer.studioName ?? '',
          role: 'PHOTOGRAPHER',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.studioName = user.studioName
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.studioName = token.studioName as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}
