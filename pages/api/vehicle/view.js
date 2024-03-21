import { ObjectId } from 'mongodb'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../../../lib/mongodb'

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
    const vehicle = await db
        .collection('vehicles')
        .findOne({ user_email: userEmail, _id: ObjectId(vid) })
    client.close()
    res.status(201).json({
        message: 'Vehicle Pulled!',
        vehicle: vehicle,
        email: userEmail,
    })
}
export default handler
