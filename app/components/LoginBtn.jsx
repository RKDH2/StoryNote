"use client";

import { signIn, signOut } from "next-auth/react";
import "@/app/components/styles/LogInOutBtn.css";
import { IoLogInOutline } from "react-icons/io5";

export default function LoginBtn() {
  return (
    <button
      className="__Log-In-Out-Btn__"
      onClick={() => {
        signIn();
      }}
    >
      Login
      <IoLogInOutline size={20} className="__IoLogInOutline__" />
    </button>
  );
}
