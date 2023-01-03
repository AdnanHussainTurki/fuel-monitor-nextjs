import { ObjectId } from 'mongodb'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'POST') {
        return
    }
    const data = req.body
    const {
        account, name
    } = data
    if (
        !account ||
        !name
    ) {
        res.status(422).json({
            message: 'Invalid input.',
        })
        return
    }
    const session = await getSession({ req: req })
    if (!session) {
        res.status(401).json({ message: 'Not authenticated!' })
        return
    }
    const userEmail = session.user.email
    const client = await connectToDatabase()
    const db = await client.db()
    const existingUser = await db
        .collection('compromised')
        .findOne({ account: account, user_email: userEmail })
    if (existingUser) {
        res.status(422).json({ message: 'Compromised account exists already!' })
        client.close()
        return
    }

    const compromised = await db
        .collection('compromised')
        .insertOne({
            user_email: userEmail,
            account: account,
            name: name,
            createdAt: new Date(),
        })
    console.log(compromised);
    const existing = await db
        .collection('compromised')
        .findOne({ user_email: userEmail, _id: ObjectId(compromised.insertedId) })
    console.log(existing);

    client.close()
    res.status(201).json({ message: 'Added compromised account!', compromised: existing })
}
export default handler
