import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import LoginBtn from "./components/LoginBtn";
import LogOutBtn from "./components/LogOutBtn";

export default async function Home() {
  let session = await getServerSession(authOptions);
  console.log(session); // 유저 정보 출력
  return (
    <div className={styles.container}>
      <div className={styles.title_text}>
        {session
          ? `${session.user.name}님! 새 글을 남겨보세요!`
          : "로그인을 해주세요!"}
      </div>
      <div className={styles.sub_text}>
        <p className={styles.comment}>코멘트 남기고 가기!</p>
        <p>부적절한 댓글은 삼가해주세요!</p>
      </div>
      {session ? (
        <>
          <Link href="/list" className={styles.btn}>
            START
          </Link>
          <LogOutBtn />
        </>
      ) : (
        <LoginBtn />
      )}
    </div>
  );
}
