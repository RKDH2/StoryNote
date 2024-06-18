"use client";

import Link from "next/link";
import "./styles/Navbar.css";
import { FaHome } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import { IoFileTrayFull } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // console.log(window.scrollY);
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`Navbar ${scrolled ? "scrolled" : ""}`}>
      <Link href="/">
        <FaHome />
        <p>홈</p>
      </Link>
      <Link href="/list">
        <FaClipboardList />
        <p>블로그</p>
      </Link>
      <Link href="/write">
        <FaFilePen />
        <p>글 작성하기</p>
      </Link>
      <Link href="/mylist">
        <IoFileTrayFull />
        <p>내 글 보러가기</p>
      </Link>
    </div>
  );
}
