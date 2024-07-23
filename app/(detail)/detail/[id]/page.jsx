import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import styles from "../../components/styles/detail.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Comment from "../../components/Comment";

export default async function Detail(props) {
  const db = (await connectDB).db("forum");
  let result = await db.collection("community_post").findOne({
    _id: new ObjectId(props.params.id),
  });
  let session = await getServerSession(authOptions);
  let author_name = null;
  if (session !== null) {
    author_name = session.user.name;
  }

  return (
    <div className={styles.detailBackgroundContainer}>
      <div className={styles.detailContainer}>
        <div className={styles.profileContainer}>
          <img
            src={result.profile_img ? result.profile_img : "/noprofile.svg"}
            className={styles.profileImg}
          />
          <p>{result.author_name}</p>
        </div>
        <p className={styles.detailTitle}>{result.title}</p>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className={styles.detailContent}
        >
          {result.content}
        </ReactMarkdown>
        {result.imgSrc ? (
          result.imgSrc.startsWith("https://") ? (
            <img src={result.imgSrc} className={styles.detailImg} />
          ) : (
            <img
              src={`https://scriptpartyimage.s3.ap-northeast-2.amazonaws.com/${result.imgSrc}`}
              className={styles.detailImg}
            />
          )
        ) : null}
        {result.tags && result.tags.length > 0 ? (
          <p className={styles.detailTags}>
            {result.tags.split(",").map((tag, i) => (
              <span key={i} className={styles.detailTag}>
                #{tag}
              </span>
            ))}
          </p>
        ) : null}
        <Comment _id={result._id.toString()} />
      </div>
    </div>
  );
}
