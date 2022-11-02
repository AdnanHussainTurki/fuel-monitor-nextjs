import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }
  const data = req.body
  const { brand, model, type } = data
  if (!brand || !model || !type) {
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
    .collection('vehicles')
    .findOne({ brand: brand, model: model, user_email: userEmail })
  if (existingUser) {
    res.status(422).json({ message: 'Vehicle exists already!' })
    client.close()
    return
  }

  await db
    .collection('vehicles')
    .insertOne({ brand: brand, model: model, user_email: userEmail, type: type, createdAt: new Date() })
  client.close()
  res.status(201).json({ message: 'Created vehicle!' })
}
export default handler
