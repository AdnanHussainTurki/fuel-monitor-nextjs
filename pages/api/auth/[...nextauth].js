import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/mongodb'
export default NextAuth({
    session: {
        jwt: true,
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const client = await connectToDatabase()
                const usersCollection = await client.db().collection('users')
                const user = await usersCollection.findOne({
                    email: credentials.email,
                })
                if (!user) {
                    throw new Error('No user found!')
                }
                const isValid =
                    credentials.loginOtp.toString() ===
                    user.loginCode.toString()
                if (!isValid) {
                    client.close()
                    throw new Error('Could not log you in!')
                }
                client.close()
                return { email: user.email, name: user.name }
            },
        }),
    ],
})
