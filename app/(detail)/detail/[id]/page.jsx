import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import "../../components/styles/detail.css";
import BackBtn from "../../components/BackBtn";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    <div className="detail-background-container">
      <div className="detail-container">
        <div className="profile-container">
          <img
            src={result.profile_img ? result.profile_img : "/noprofile.svg"}
            className="profile_img"
          />

          <p>{result.author_name}</p>
        </div>
        <p className="detail-title">{result.title}</p>
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="detail-content">
          {result.content}
        </ReactMarkdown>
        {result.imgSrc ? (
          result.imgSrc.startsWith("https://") ? (
            <img src={result.imgSrc} className="detail-img" />
          ) : (
            <img
              src={`https://scriptpartyimage.s3.ap-northeast-2.amazonaws.com/${result.imgSrc}`}
              className="detail-img"
            />
          )
        ) : null}
        {result.tags && result.tags.length > 0 ? (
          <p className="detail-tags">
            {result.tags.split(",").map((tag, i) => (
              <span key={i} className="detail-tag">
                #{tag}
              </span>
            ))}
          </p>
        ) : null}
        <BackBtn />
      </div>
    </div>
  );
}
