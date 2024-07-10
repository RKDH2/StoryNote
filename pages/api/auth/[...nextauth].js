import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_OAUTH_ID || "",
    //   clientSecret: process.env.GOOGLE_OAUTH_SECRET || "",
    // }),
    // KakaoProvider({
    //   clientId: process.env.KAKAO_CLIENT_ID || "",
    //   clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    //   allowDangerousEmailAccountLinking: true,
    // }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      //1. 로그인페이지 폼 자동생성해주는 코드
      name: "credentials",
      credentials: {
        id: { label: "id", type: "text" },
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      //2. 로그인요청시 실행되는코드
      //직접 DB에서 아이디,비번 비교하고
      //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials) {
        let db = (await connectDB).db("signup");
        let user = await db
          .collection("user_cred")
          .findOne({ email: credentials.email });

        if (!user) {
          console.log("해당 이메일은 없음");
          return null;
        }

        if (user.id !== credentials.id) {
          console.log("해당 아이디는 없음");
          return null;
        }

        const pwcheck = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!pwcheck) {
          console.log("비밀번호가 틀렸습니다.");
          return null;
        }
        return user;
      },
    }),
  ],

  //3. jwt 써놔야 잘됩니다 + jwt 만료일설정
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30일
  },

  callbacks: {
    // jwt 만들 때 실행되는 코드
    // user 변수는 DB의 유저 정보가 담겨 있고 token.user에 저장하면 jwt에 들어갑니다.
    jwt: async ({ token, user }) => {
      console.log(user);
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      console.log("Token:", token);
      return token;
    },
    // 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(connectDB),

  // pages: {
  //   signIn: "/api/auth/signin",
  // },
};

export default NextAuth(authOptions);
