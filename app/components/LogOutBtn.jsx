"use client";

import { signIn, signOut } from "next-auth/react";
import "@/app/components/styles/LogInOutBtn.css";
import { IoLogInOutline } from "react-icons/io5";

export default function LogOutBtn() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button className="__Log-In-Out-Btn__" onClick={handleLogout}>
      Sign out
      <IoLogInOutline size={20} className="__IoLogInOutline__" />
    </button>
  );
}
