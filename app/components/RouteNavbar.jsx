"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";

export default function RouteNavbar({ children }) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/";
  return <>{showNavbar && <Navbar />}</>;
}
