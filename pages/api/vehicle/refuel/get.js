import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' })
        return
    }

    const session = await getServerSession(req, res)
    if (!session) {
        res.status(401).json({ message: 'Not authenticated!' })
        return
    }
    const rid = req.query.rid

    if (!rid) {
        res.status(422).json({
            message: 'Invalid input.',
        })
        return
    }
    //   TODO: Add check for rid
    const userEmail = session.user.email
    const client = await connectToDatabase()
    const db = await client.db()

    const existing = await db
        .collection('refuels')
        .findOne({ _id: ObjectId(rid), user_email: userEmail })
    if (!existing) {
        res.status(422).json({ message: 'Refuel record not found!' })
        client.close()
        return
    }
    client.close()
    res.status(201).json({
        message: 'Required Refueling Pulled!',
        refuel: existing,
        rid: rid,
        email: userEmail,
    })
}
export default handler
