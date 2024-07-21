"use client";

import { signOut } from "next-auth/react";
import styles from "./styles/LogInOutBtn.module.css";
import { IoLogInOutline } from "react-icons/io5";

export default function LogOutBtn() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button className={styles.logInOutBtn} onClick={handleLogout}>
      Sign out
      <IoLogInOutline size={20} className={styles.icon} />
    </button>
  );
}
