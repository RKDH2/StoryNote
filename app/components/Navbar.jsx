import Link from "next/link";
import styles from "./styles/Navbar.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import LoginBtn from "./LoginBtn";
import LogOutBtn from "./LogOutBtn";

export default async function Navbar() {
  let session = await getServerSession(authOptions);
  return (
    <div className={styles.Navbar}>
      <header className={styles.navbar_container}>
        <Link href="/" className={styles.logo_img}>
          <img src="/ScriptPartyLogo.svg" />
        </Link>
        <div className={styles.menu_items}>
          <Link href="/community">
            <p>커뮤니티</p>
          </Link>
          {session ? (
            <>
              <Link href="/write">
                <p>작성하기</p>
              </Link>
              <Link href="/mylist">
                <p>활동내역</p>
              </Link>
            </>
          ) : null}
          <div className={styles.menu_line}></div>
          <Link href="/">
            <p>이벤트</p>
          </Link>
          <Link href="/">
            <p>공지</p>
          </Link>
        </div>
        <div className={styles.login_section}>
          {session ? (
            <>
              <img
                className={styles.profile}
                src={session.user.image || "/public/noprofile.svg"}
                alt="프로필"
              />
              <LogOutBtn />
            </>
          ) : (
            <>
              <LoginBtn />
            </>
          )}
        </div>
      </header>
    </div>
  );
}
