"use client";

import { signIn, signOut } from "next-auth/react";
import "@/app/components/styles/LogInOutBtn.css";

export default function LoginBtn() {
  return (
    <button
      className="__Log-In-Out-Btn__"
      onClick={() => {
        signIn();
      }}
    >
      Login
    </button>
  );
}
