import List from "./(list)/list/page";
import styles from "./page.module.css";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import MainPage from "./components/MainPage";

export const dynamic = "force-dynamic";

const db = (await connectDB).db("forum");
let result = await db
  .collection("post")
  .find()
  .sort({ post_time: -1 })
  .toArray();

result = result.map((a) => {
  a._id = a._id.toString();
  return a;
});

let session = await getServerSession(authOptions);

export default async function Home() {
  return (
    <div className={styles.container}>
      <MainPage result={result} session={session} />
    </div>
  );
}
