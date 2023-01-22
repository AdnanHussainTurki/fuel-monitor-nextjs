import { ObjectId } from 'mongodb'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    const session = await getSession({ req: req })
    if (!session) {
        res.status(401).json({ message: 'Not authenticated!' })
        return
    }
    const rid = req.query.rid;
    console.log(req.query)
    console.log({ rid })
    //   TODO: Add check for rid
    const userEmail = session.user.email
    const client = await connectToDatabase()
    const db = await client.db()
    console.log({ user_email: userEmail, _id: ObjectId(rid) })
    const cursor = await db
        .collection('refuels')
        .find({ "_id": ObjectId(rid), "user_email": userEmail })
        .sort({ created_at: -1 })
        .limit(1)
    const currentRefuel = await cursor.toArray()
    //   Get the previous refuel by created_at
    const cursor2 = await db
        .collection('refuels')
        .find({ "vid": ObjectId(currentRefuel[0].vid), "user_email": userEmail, "created_at": { $lt: currentRefuel[0].created_at } })
        .sort({ created_at: -1 })
        .limit(1)
    const result = await cursor2.toArray()
    console.log("result", result)
    client.close()
    res.status(201).json({ message: 'Previous Refueling Pulled!', refuel: result, email: userEmail })
}
export default handler
