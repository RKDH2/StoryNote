"use client";

import { signIn, signOut } from "next-auth/react";
import "@/app/components/styles/LogInOutBtn.css";

export default function LogOutBtn() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button className="__Log-In-Out-Btn__" onClick={handleLogout}>
      Sign out
    </button>
  );
}
