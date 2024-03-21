import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405)
        return
    }
    const data = req.body
    const { rid } = data
    if (!rid) {
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
        .collection('refuels')
        .findOne({ _id: ObjectId(rid), user_email: userEmail })
    if (!existing) {
        res.status(422).json({ message: 'Refuel not found!' })
        client.close()
        return
    }

    await db.collection('refuels').remove({ _id: ObjectId(rid) })
    await db.collection('refuels').remove({ rid: ObjectId(rid) })
    client.close()
    res.status(201).json({ message: 'Refuel record deleted!' })
}
export default handler
