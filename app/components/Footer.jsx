import Link from "next/link";
import "./styles/Footer.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import LoginBtn from "../components/LoginBtn";
import LogOutBtn from "../components/LogOutBtn";
import { MdAccountCircle } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaPenToSquare } from "react-icons/fa6";
import { MdOutlineHistoryEdu } from "react-icons/md";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { MdOutlineCircleNotifications } from "react-icons/md";

export default async function Footer() {
  let session = await getServerSession(authOptions);

  return (
    <div className="Footer">
      <footer className="footer-items">
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
        <Link href="/">
          <MdOutlineEmojiEvents size={30} />
          <p>이벤트</p>
        </Link>
        <Link href="/">
          <MdOutlineCircleNotifications size={30} />
          <p>공지</p>
        </Link>
      </footer>
    </div>
  );
}
