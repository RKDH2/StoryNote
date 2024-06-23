import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import "../../components/styles/detail.css";
import BackBtn from "../../components/BackBtn";

export default async function Detail(props) {
  const db = (await connectDB).db("forum");
  let result = await db.collection("post").findOne({
    _id: new ObjectId(props.params.id),
  });

  let session = await getServerSession(authOptions);

  let author_name = null;

  if (session !== null) {
    author_name = session.user.name;
  }

  return (
    <div className="detail-container">
      <p>{result.author_name}</p>
      <p>{result.title}</p>
      <p>{result.content}</p>
      {result.imgSrc && (
        <img
          src={`https://scriptpartyimage.s3.ap-northeast-2.amazonaws.com/${result.imgSrc}`}
          className="detail-img"
        />
      )}
      {result.tags && result.tags.length > 0 ? (
        <p className="detail-tags">
          {result.tags.split(",").map((tag, i) => (
            <span key={i} className="detail-tag">
              {tag}
            </span>
          ))}
        </p>
      ) : null}
      <BackBtn />
    </div>
  );
}
