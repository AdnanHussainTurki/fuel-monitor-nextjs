import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

export async function connectToDatabase() {
    const client = await MongoClient.connect(uri, options)
    return client
}
