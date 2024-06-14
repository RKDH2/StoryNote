"use client";

import { signIn, signOut } from "next-auth/react";
import "@/app/components/styles/LogInOutBtn.css";

export default function LogOutBtn() {
  return (
    <button
      className="__Log-In-Out-Btn__"
      onClick={() => {
        signOut();
      }}
    >
      Sign out
    </button>
  );
}
