import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'POST') {
        return
    }
    const data = req.body
    const {
        rid,
        vid,
        spending,
        meter_reading,
        rate_per_litre,
        refuel_on,
        percent_before_refuel,
        continued,
    } = data
    if (
        !rid ||
        !vid ||
        !spending ||
        !meter_reading ||
        !rate_per_litre ||
        !refuel_on
    ) {
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
        res.status(422).json({ message: 'Refuel record not found!' })
        client.close()
        return
    }
    await db.collection('refuels').updateOne(
        { _id: ObjectId(rid) },
        {
            $set: {
                vid: ObjectId(vid),
                spending,
                meter_reading,
                rate_per_litre,
                refuel_on,
                percent_before_refuel,
                user_email: userEmail,
                updated_at: new Date(),
                continued,
            },
        }
    )
    const refuel = await db
        .collection('refuels')
        .findOne({ _id: ObjectId(rid), user_email: userEmail })

    client.close()
    res.status(201).json({ message: 'Refuel corrected!', refuel: refuel })
}
export default handler
