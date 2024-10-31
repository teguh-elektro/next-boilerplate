import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import Users from '@/models/Users';
import bcrypt from 'bcrypt';
import { generateRandomBase64 } from '@/lib/util';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();

                if (!credentials) return null;

                const user = await Users.findOne({ email: credentials.email });

                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        subscribe: user.subscribe
                    };
                }

                return null;
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect();
            if (account?.provider === 'google' && profile?.email) {
                const existingUser = await Users.findOne({ email: profile.email });
                if (!existingUser) {
                    const newUser = new Users({
                        userID: user.id,
                        name: profile.name,
                        email: profile.email,
                        password: await bcrypt.hash(generateRandomBase64(10), 10), // Generate random password for Google users
                        createdAt: new Date(),
                        subscribe: 'free', // Set default subscription
                    });
                    await newUser.save();
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if(trigger === 'update' || trigger === 'signIn') {
                const foundUser = await Users.findOne({ email: trigger === 'signIn' ? user.email : session.user.email });
                console.log({ email: trigger === 'signIn' ? user.email : session.user.email, foundUser })
                if (foundUser) {
                    token.subscribe = foundUser.subscribe;
                }
                return token
            }
            
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.subscribe = token.subscribe as string; // Set subscription status in session
                session.user.id = token.id as string; // Set user ID in session
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
