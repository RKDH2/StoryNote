import { MongoClient } from "mongodb";

const url = process.env.MONGOURL;
if (!url) {
  throw new Error("MONGOURL 환경 변수가 정의되지 않았습니다.");
}

let connectDB;

if (process.env.NODE_ENV === "development") {
  if (!global._mongo) {
    global._mongo = new MongoClient(url).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(url).connect();
}
export { connectDB };
