import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
console.log("MONGO:",uri)
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

export async function connectToDatabase() {
  const client = await MongoClient.connect(uri, options)
  return client;
}