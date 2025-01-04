import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import Students from '@/models/StudentModel'
import { connectToDatabase } from '@/libs/mongo/config'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase()

        const user = await Students.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          picture: user.picture,
          preferences: user.preferences
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 604800 },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = {
          ...user
        }
      }
      if (trigger === 'update' && session?.newPreferences) {
        token.user.preferences = session.newPreferences
      }
      if (trigger === 'update' && session?.newProfile) {
        token.user = session.newProfile
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
