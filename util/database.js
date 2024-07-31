import { MongoClient } from "mongodb";

const url = process.env.MONGOURL;
if (!url) {
  throw new Error("MONGOURL 환경 변수가 정의되지 않았습니다.");
}

let connectDB;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (process.env.NODE_ENV === "development") {
  if (!global._mongo) {
    global._mongo = client.connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = client.connect();
}

export { connectDB };
