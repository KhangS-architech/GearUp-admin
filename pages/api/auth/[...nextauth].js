import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from '@/lib/mongodb'
import { Admin } from '@/models/Admin'
import { mongooseConnect } from '@/lib/mongoose'


async function isAdminEmail(email) {
  mongooseConnect()
  const admin = await Admin.findOne({email}, { _id: 0, email: 1 })
  return !!admin
}


export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session,token,user}) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  try {
  const session = await getServerSession(req,res,authOptions)
  if (!(await isAdminEmail(session?.user?.email))) {
    throw new Error('Không phải admin')
    } 
  } catch (error) {
    res.status(401).json({ error: error.message })
    return
  }
}
