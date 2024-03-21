import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405)
        return
    }
    const data = req.body
    const {
        vid,
        brand,
        model,
        type,
        currency,
        fuelCapacity,
        fuelReserve,
        fuelType,
    } = data
    if (
        !vid ||
        !brand ||
        !model ||
        !type ||
        !currency ||
        !fuelCapacity ||
        !fuelReserve ||
        !fuelType
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
        .collection('vehicles')
        .findOne({ _id: ObjectId(vid), user_email: userEmail })
    if (!existing) {
        res.status(422).json({ message: 'Vehicle not found!' })
        client.close()
        return
    }

    await db.collection('vehicles').updateOne(
        { _id: ObjectId(vid) },
        {
            $set: {
                brand: brand,
                model: model,
                user_email: userEmail,
                type: type,
                currency: currency,
                fuelCapacity: fuelCapacity,
                fuelReserve: fuelReserve,
                fuelType: fuelType,
                updatedAt: new Date(),
            },
        }
    )
    client.close()
    res.status(201).json({ message: 'Vehicle edited!' })
}
export default handler
