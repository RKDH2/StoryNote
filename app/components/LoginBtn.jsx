"use client";

import { signIn } from "next-auth/react";
import styles from "./styles/LogInOutBtn.module.css";
import { IoLogInOutline } from "react-icons/io5";

export default function LoginBtn() {
  return (
    <button className={styles.logInOutBtn} onClick={() => signIn()}>
      로그인
      <IoLogInOutline size={20} className={styles.icon} />
    </button>
  );
}
