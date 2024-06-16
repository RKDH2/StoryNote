"use client";

import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import "../components/styles/detail.css";

export default function BackBtn() {
  const router = useRouter();

  return (
    <button
      className="back-btn"
      onClick={() => {
        router.back();
      }}
    >
      <IoArrowBack size={20} />
    </button>
  );
}
