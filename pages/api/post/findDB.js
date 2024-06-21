import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const db = (await connectDB).db("forum");
      let result = await db
        .collection("post")
        .findOne({ _id: new ObjectId(req.query.id) });

      if (result) {
        console.log(result);

        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
}
