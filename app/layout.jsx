import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./loading";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "이야기 노트",
  description: "나의 이야기를 작성하세요.",
  icons: {
    icon: "/Union.svg",
  },
};

export default async function RootLayout({ children }) {
  let session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} layout`}>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <main>{children}</main>
        </Suspense>
        <Footer session={session} />
      </body>
    </html>
  );
}
