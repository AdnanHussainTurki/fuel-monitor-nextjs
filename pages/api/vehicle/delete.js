import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405)
        return
    }
    const data = req.body
    const { vid } = data
    if (!vid) {
        res.status(422).json({
            message: 'Invalid input.',
        })
        return
    }
    const session = await getServerSession(req, res)
    if (!session) {
        res.status(401).json({ message: 'Not authenticated!' })
        return
    }
    const userEmail = session.user.email
    const client = await connectToDatabase()
    const db = await client.db()
    const existing = await db
        .collection('vehicles')
        .findOne({ _id: ObjectId(vid), user_email: userEmail })
    if (!existing) {
        res.status(422).json({ message: 'Vehicle not found!' })
        client.close()
        return
    }

    await db.collection('vehicles').remove({ _id: ObjectId(vid) })
    await db.collection('refuels').remove({ vid: ObjectId(vid) })
    client.close()
    res.status(201).json({ message: 'Vehicle deleted!' })
}
export default handler
