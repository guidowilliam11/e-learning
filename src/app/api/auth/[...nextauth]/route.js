import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import User from '@/models/userModel'
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

        const user = await User.findOne({ email: credentials.email })
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

        return { id: user._id, email: user.email }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
