import Link from "next/link";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPenToSquare } from "react-icons/fa6";
import { MdOutlineHistoryEdu } from "react-icons/md";
import styles from "../components/styles/Footer.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function Footer() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Failed to get session:", error);
  }

  return (
    <div className={styles.footer}>
      <footer className={styles.footerItems}>
        <Link href="/community">
          <IoPeopleSharp size={30} />
          <p>커뮤니티</p>
        </Link>
        {session ? (
          <>
            <Link href="/write">
              <FaPenToSquare size={30} />
              <p>작성하기</p>
            </Link>
            <Link href="/mylist">
              <MdOutlineHistoryEdu size={30} />
              <p>활동내역</p>
            </Link>
          </>
        ) : null}
      </footer>
    </div>
  );
}
