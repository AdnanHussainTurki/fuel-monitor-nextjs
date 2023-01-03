import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
  if (req.method !== 'GET') {
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
  const compromiseds = await db
    .collection('compromised')
    .find({ user_email: userEmail })
    .sort({ createdAt: -1 })
    .toArray();
  client.close()
  res.status(201).json({ message: 'Compromised Pulled!', compromiseds: compromiseds, email: userEmail })
}
export default handler
