import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'GET') {
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
    const brands = await db
        .collection('brands')
        .find()
        .sort({ usage: -1 })
        .toArray()
    client.close()
    res.status(201).json({
        message: 'Brands Pulled!',
        brands: brands,
        email: userEmail,
    })
}
export default handler
