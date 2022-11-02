import { hashPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const data = req.body
  const { email, password, name } = data
  if (
    !name ||
    !email ||
    !password ||
    !email.includes('@') ||
    password.trim().length < 7
  ) {
    res
      .status(422)
      .json({
        message: 'Invalid input. Password must be at least 7 characters long.',
      })
    return
  }
  const client = await connectToDatabase()
  const db = await client.db()
  const existingUser = await db.collection('users').findOne({ email: email })
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' })
    client.close()
    return
  }

  const hashedPassword = await hashPassword(password)
  await db.collection('users').insertOne({
    name: name,
    email: email,
    password: hashedPassword,
  })
  client.close()
  res.status(201).json({ message: 'Created user!' })
}
export default handler
