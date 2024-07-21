"use client";

import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import styles from "./styles/detail.module.css";

export default function BackBtn() {
  const router = useRouter();

  return (
    <button
      className={styles.backBtn}
      onClick={() => {
        router.back();
      }}
    >
      <IoArrowBack size={20} />
    </button>
  );
}
