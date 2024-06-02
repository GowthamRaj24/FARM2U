import UserB from '@/models/UserB'
import dbConnect from '@/utils/dbConnect'
import NextAuth,{NextAuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import {compare} from 'bcryptjs'
const options:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials) {
                await dbConnect().catch(err=>{throw new Error(err)})
                const user=await UserB.findOne({
                    email:credentials?.email
                }).select("+password")
                if(!user){
                    throw new Error("Invalid credentials")
                }
                const isPasswordCorrect=await compare(credentials!.password,user.password)
                if(!isPasswordCorrect){
                    throw new Error("Invalid credentials")
                }
                return user
            }
        })
    ],
    pages:{
        signIn:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:24 * 60 * 60
    },
    jwt:{
        secret: process.env.NEXTAUTH_SECRET,
        maxAge:24 * 60 * 60
    },
    callbacks:{
        jwt :async({token,user})=>{
            user && (token.user=user)
            return token
        },
        session:async({session,token})=>{
            const user=token.user as any
            session.user=user
            return session
        },
        redirect: async ({ url, baseUrl }) => {
            return baseUrl + "/login" // Redirect to the login page
        }
    }
}
export default NextAuth(options);