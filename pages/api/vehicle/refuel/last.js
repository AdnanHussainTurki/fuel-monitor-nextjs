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
    const vid = req.query.vid

    //   TODO: Add check for vid
    const userEmail = session.user.email
    const client = await connectToDatabase()
    const db = await client.db()

    const cursor = await db
        .collection('refuels')
        .find({ vid: ObjectId(vid) })
        .sort({ created_at: -1 })
        .limit(1)

    const result = await cursor.toArray()
    client.close()
    res.status(201).json({
        message: 'Last Refueling Pulled!',
        refuel: result,
        email: userEmail,
    })
}
export default handler
