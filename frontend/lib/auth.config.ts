import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    newUser: '/complete-profile', // Redirect new SSO users to profile completion
  },

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id
        if (account?.provider) {
          token.provider = account.provider
        }
      }

      // Always fetch the latest profileCompleted status
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { profileCompleted: true }
        })
        token.profileCompleted = dbUser?.profileCompleted || false
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.provider = token.provider as string
        session.user.profileCompleted = token.profileCompleted as boolean
      }
      return session
    },

    async signIn({ user, account, profile }) {
      try {
        // Update last login and provider info for existing users
        if (user?.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          if (existingUser) {
            // User exists, update their info
            const updateData: any = {
              lastLoginAt: new Date()
            }

            // For OAuth providers, update provider info
            if (account?.provider && account.provider !== 'credentials') {
              updateData.provider = account.provider
              updateData.providerId = account.providerAccountId
            }

            await prisma.user.update({
              where: { email: user.email },
              data: updateData
            })
          }
          // If user doesn't exist, Prisma Adapter will create them
        }
      } catch (error) {
        console.error('SignIn callback error:', error)
        // Don't block login if update fails
      }

      return true
    }
  },

  debug: process.env.NODE_ENV === 'development',
}
