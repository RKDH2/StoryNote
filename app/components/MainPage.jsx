import Link from "next/link";
import stylys from "../components/styles/MainPage.module.css";

export default function MainPage({ result, session }) {
  return (
    <main>
      <div className={stylys.ad}></div>
      <div className={stylys.main_page_}></div>
      <div className={stylys.ad}></div>
    </main>
  );
}
