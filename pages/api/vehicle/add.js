import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../lib/mongodb'
import { getServerSession } from 'next-auth'

async function handler(req, res) {
    if (req.method !== 'POST') {
        return
    }
    const data = req.body
    const {
        brand,
        model,
        type,
        currency,
        fuelCapacity,
        fuelReserve,
        fuelType,
    } = data
    if (
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
    const existingUser = await db
        .collection('vehicles')
        .findOne({ brand: brand, model: model, user_email: userEmail })
    if (existingUser) {
        res.status(422).json({ message: 'Vehicle exists already!' })
        client.close()
        return
    }

    const vehicle = await db.collection('vehicles').insertOne({
        brand: brand,
        model: model,
        user_email: userEmail,
        type: type,
        currency: currency,
        fuelCapacity: fuelCapacity,
        fuelReserve: fuelReserve,
        fuelType: fuelType,
        createdAt: new Date(),
    })
    client.close()
    res.status(201).json({ message: 'Created vehicle!', vehicle: vehicle })
}
export default handler
