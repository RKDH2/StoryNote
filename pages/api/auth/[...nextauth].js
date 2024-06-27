import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_SECRET || "",
      // allowDangerousEmailAccountLinking: true,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    // NaverProvider({
    //   clientId: process.env.NAVER_CLIENT_ID || "",
    //   clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    // }),
  ],

  //3. jwt 써놔야 잘됩니다 + jwt 만료일설정
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30일
  },

  callbacks: {
    // jwt 만들 때 실행되는 코드
    // user 변수는 DB의 유저 정보가 담겨 있고 token.user에 저장하면 jwt에 들어갑니다.
    jwt: async ({ token, user, profile }) => {
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
        };
      } else if (profile) {
        // KakaoProvider에서 받은 프로필 정보를 토큰에 추가합니다.
        token.user = {
          name: profile.username || "No Username", // Kakao의 경우 username을 사용할 수 있습니다.
          email: profile.email || "No Email",
          image: profile.image || "No Image",
        };
      }
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
};

export default NextAuth(authOptions);
